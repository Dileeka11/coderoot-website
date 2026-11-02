<?php

namespace Tests\Feature;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectPageTest extends TestCase
{
    use RefreshDatabase;

    private string $shellDirectory;

    protected function setUp(): void
    {
        parent::setUp();

        // A stand-in for the page the Next.js build writes.
        $this->shellDirectory = sys_get_temp_dir().'/coderoot-shell-'.uniqid();
        mkdir($this->shellDirectory.'/projects', recursive: true);
        file_put_contents($this->shellDirectory.'/projects/item.html', '<html><head><title>Project | CodeRoot Solutions</title>'
            .'<meta name="description" content="A project by CodeRoot Solutions."/><meta name="robots" content="noindex, follow"/>'
            .'<meta property="og:title" content="Generic"/><meta name="twitter:title" content="Generic"/></head><body>shell</body></html>');
        file_put_contents($this->shellDirectory.'/404.html', '<html><body>not found page</body></html>');
        $this->app->usePublicPath($this->shellDirectory);
    }

    protected function tearDown(): void
    {
        array_map('unlink', [$this->shellDirectory.'/projects/item.html', $this->shellDirectory.'/404.html']);
        rmdir($this->shellDirectory.'/projects');
        rmdir($this->shellDirectory);

        parent::tearDown();
    }

    public function test_project_page_has_its_own_head_and_can_be_indexed(): void
    {
        $project = Project::factory()->create(['title' => 'Shop <b>site</b>', 'summary' => 'A fast "shop"']);

        $response = $this->get("/projects/{$project->slug}")->assertOk();

        $html = $response->getContent();
        $this->assertStringContainsString('<title>Shop &lt;b&gt;site&lt;/b&gt; | CodeRoot Solutions</title>', $html);
        $this->assertStringContainsString('content="A fast &quot;shop&quot;"', $html);
        $this->assertStringContainsString("/projects/{$project->slug}\"", $html);
        $this->assertStringNotContainsString('noindex', $html);
        $this->assertStringNotContainsString('Generic', $html);
        $this->assertStringContainsString('<body>shell</body>', $html);
        $this->assertSame(1, substr_count($html, '<title>'));
        $response->assertHeaderMissing('X-Robots-Tag');
        $response->assertHeaderMissing('Set-Cookie');
    }

    public function test_draft_or_unknown_project_gets_the_not_found_page(): void
    {
        $draft = Project::factory()->draft()->create();

        $this->get("/projects/{$draft->slug}")->assertNotFound()->assertSee('not found page');
        $this->get('/projects/no-such-project')->assertNotFound();
    }

    public function test_sitemap_lists_published_projects_only(): void
    {
        $published = Project::factory()->create();
        $draft = Project::factory()->draft()->create();

        $response = $this->get('/projects-sitemap.xml')->assertOk()->assertHeader('Content-Type', 'application/xml; charset=UTF-8');

        $response->assertSee("/projects/{$published->slug}</loc>", false);
        $response->assertDontSee("/projects/{$draft->slug}<", false);
    }
}
