<?php

namespace Tests\Feature;

use App\Filament\Resources\Projects\Pages\CreateProject;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\MassAssignmentException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Livewire\Livewire;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        $user = User::factory()->create();
        $user->is_admin = true;
        $user->save();

        return $user;
    }

    public function test_guest_is_sent_to_login(): void
    {
        $this->get('/admin/projects')->assertRedirect('/admin/login');
    }

    public function test_non_admin_user_cannot_enter_the_panel(): void
    {
        $this->actingAs(User::factory()->create())->get('/admin/projects')->assertForbidden();
    }

    public function test_admin_can_open_the_projects_page(): void
    {
        $this->actingAs($this->admin())->get('/admin/projects')->assertOk();
    }

    public function test_is_admin_cannot_be_mass_assigned(): void
    {
        $this->expectException(MassAssignmentException::class);

        new User(['name' => 'a', 'email' => 'a@example.com', 'password' => 'secret-secret', 'is_admin' => true]);
    }

    public function test_admin_can_add_a_project_and_the_image_is_rebuilt_as_webp(): void
    {
        Storage::fake('public');
        Http::fake();
        $this->actingAs($this->admin());

        Livewire::test(CreateProject::class)
            ->fillForm([
                'title' => 'Test Project',
                'slug' => 'test-project',
                'category' => 'website',
                'summary' => 'A short summary.',
                'description' => 'A longer description.',
                'is_published' => true,
                'cover_image' => UploadedFile::fake()->image('Photo With Spaces.jpg', 1200, 800),
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $project = Project::where('slug', 'test-project')->firstOrFail();

        $this->assertMatchesRegularExpression('#^projects/[A-Za-z0-9]{40}\.webp$#', $project->cover_image);
        Storage::disk('public')->assertExists($project->cover_image);
        $this->assertStringStartsWith('RIFF', substr(Storage::disk('public')->get($project->cover_image), 0, 4));
        $this->assertNotNull($project->published_at);
    }

    public function test_svg_upload_is_rejected(): void
    {
        Storage::fake('public');
        $this->actingAs($this->admin());

        $svg = UploadedFile::fake()->createWithContent('logo.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');

        Livewire::test(CreateProject::class)
            ->fillForm(['title' => 'Bad', 'cover_image' => $svg])
            ->call('create')
            ->assertHasFormErrors(['cover_image']);

        $this->assertSame(0, Project::count());
    }

    public function test_php_file_disguised_as_an_image_is_rejected(): void
    {
        Storage::fake('public');
        $this->actingAs($this->admin());

        $fake = UploadedFile::fake()->createWithContent('shell.php.jpg', '<?php echo "owned"; ?>');

        Livewire::test(CreateProject::class)
            ->fillForm([
                'title' => 'Bad',
                'slug' => 'bad',
                'category' => 'website',
                'summary' => 'A short summary.',
                'description' => 'A longer description.',
                'cover_image' => $fake,
            ])
            ->call('create')
            ->assertHasFormErrors(['cover_image']);

        $this->assertSame(0, Project::count());
        $this->assertSame([], Storage::disk('public')->allFiles());
    }

    public function test_javascript_url_is_rejected(): void
    {
        Storage::fake('public');
        $this->actingAs($this->admin());

        Livewire::test(CreateProject::class)
            ->fillForm(['title' => 'Bad', 'live_url' => 'javascript:alert(1)'])
            ->call('create')
            ->assertHasFormErrors(['live_url']);
    }

    public function test_image_paths_outside_the_upload_folder_are_refused(): void
    {
        $this->expectException(ValidationException::class);

        Project::factory()->create(['cover_image' => '../../.env']);
    }

    public function test_saving_a_project_tells_the_frontend_to_refresh(): void
    {
        Http::fake();
        config(['services.frontend.url' => 'https://site.test', 'services.frontend.revalidate_secret' => 'shared-secret']);

        Project::factory()->create();
        app()->terminate();

        Http::assertSent(fn ($request) => $request->url() === 'https://site.test/api/revalidate'
            && $request->hasHeader('x-revalidate-secret', 'shared-secret'));
    }

    public function test_an_unreachable_frontend_does_not_break_saving(): void
    {
        Http::fake(['*' => Http::response(status: 500)]);
        config(['services.frontend.url' => 'https://site.test', 'services.frontend.revalidate_secret' => 'shared-secret']);

        $project = Project::factory()->create();
        app()->terminate();

        $this->assertModelExists($project);
    }

    public function test_deleting_a_project_removes_its_images(): void
    {
        Storage::fake('public');
        Http::fake();
        Storage::disk('public')->put('projects/cover.webp', 'x');
        Storage::disk('public')->put('projects/one.webp', 'x');

        $project = Project::factory()->create([
            'cover_image' => 'projects/cover.webp',
            'gallery' => ['projects/one.webp'],
        ]);

        $project->delete();

        Storage::disk('public')->assertMissing('projects/cover.webp');
        Storage::disk('public')->assertMissing('projects/one.webp');
    }

    public function test_replacing_the_cover_removes_the_old_file(): void
    {
        Storage::fake('public');
        Http::fake();
        Storage::disk('public')->put('projects/old.webp', 'x');
        Storage::disk('public')->put('projects/new.webp', 'x');

        $project = Project::factory()->create(['cover_image' => 'projects/old.webp']);
        $project->update(['cover_image' => 'projects/new.webp']);

        Storage::disk('public')->assertMissing('projects/old.webp');
        Storage::disk('public')->assertExists('projects/new.webp');
    }
}
