<?php

namespace Tests\Feature;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_list_only_contains_published_projects(): void
    {
        $published = Project::factory()->create();
        Project::factory()->draft()->create();

        $response = $this->getJson('/api/v1/projects')->assertOk();

        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.slug', $published->slug);
    }

    public function test_draft_project_is_not_found(): void
    {
        $draft = Project::factory()->draft()->create();

        $this->getJson("/api/v1/projects/{$draft->slug}")->assertNotFound();
    }

    public function test_detail_includes_description_but_list_does_not(): void
    {
        $project = Project::factory()->create(['gallery' => ['projects/a.webp']]);

        $this->getJson('/api/v1/projects')
            ->assertJsonMissingPath('data.0.description')
            ->assertJsonMissingPath('data.0.gallery');

        $this->getJson("/api/v1/projects/{$project->slug}")
            ->assertOk()
            ->assertJsonPath('data.description', $project->description)
            ->assertJsonPath('data.gallery', ['projects/a.webp']);
    }

    public function test_response_only_exposes_listed_fields(): void
    {
        Project::factory()->create();

        $fields = array_keys($this->getJson('/api/v1/projects')->json('data.0'));

        $this->assertEqualsCanonicalizing(
            ['slug', 'title', 'category', 'client', 'summary', 'tech_stack', 'cover', 'live_url', 'year', 'featured', 'published_at', 'updated_at'],
            $fields,
        );
    }

    public function test_slug_with_unsafe_characters_does_not_reach_the_controller(): void
    {
        $this->getJson('/api/v1/projects/'.rawurlencode("x' OR '1'='1"))->assertNotFound();
    }

    public function test_write_methods_are_not_allowed(): void
    {
        $this->postJson('/api/v1/projects', ['title' => 'x'])->assertMethodNotAllowed();
        $this->deleteJson('/api/v1/projects/anything')->assertMethodNotAllowed();
    }

    public function test_api_is_rate_limited(): void
    {
        for ($i = 0; $i < 120; $i++) {
            $this->getJson('/api/v1/projects')->assertOk();
        }

        $this->getJson('/api/v1/projects')->assertStatus(429);
    }

    public function test_security_headers_are_sent(): void
    {
        $this->getJson('/api/v1/projects')
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('X-Frame-Options', 'DENY')
            ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
            ->assertHeader('Content-Security-Policy');
    }

    public function test_publishing_sets_the_publish_date_once(): void
    {
        $project = Project::factory()->draft()->create();
        $this->assertNull($project->published_at);

        $project->update(['is_published' => true]);
        $first = $project->fresh()->published_at;
        $this->assertNotNull($first);

        $this->travel(1)->hours();
        $project->update(['title' => 'Changed']);
        $this->assertTrue($first->equalTo($project->fresh()->published_at));
    }
}
