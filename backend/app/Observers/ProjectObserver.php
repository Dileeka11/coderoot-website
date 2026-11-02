<?php

namespace App\Observers;

use App\Models\Project;
use App\Services\FrontendRevalidator;
use App\Services\ProjectImageStore;
use Illuminate\Validation\ValidationException;

class ProjectObserver
{
    public function __construct(
        private readonly ProjectImageStore $images,
        private readonly FrontendRevalidator $revalidator,
    ) {}

    public function saving(Project $project): void
    {
        foreach ($this->imagePaths($project->cover_image, $project->gallery) as $path) {
            if (! ProjectImageStore::isStoredPath($path)) {
                throw ValidationException::withMessages(['cover_image' => 'That image path is not allowed.']);
            }
        }

        if ($project->is_published && $project->published_at === null) {
            $project->published_at = now();
        }
    }

    public function updated(Project $project): void
    {
        $this->images->delete(array_diff(
            $this->imagePaths($project->getOriginal('cover_image'), $project->getOriginal('gallery')),
            $this->imagePaths($project->cover_image, $project->gallery),
        ));
    }

    public function saved(Project $project): void
    {
        $this->revalidateAfterResponse();
    }

    public function deleted(Project $project): void
    {
        $this->images->delete($this->imagePaths($project->cover_image, $project->gallery));
        $this->revalidateAfterResponse();
    }

    /**
     * @param  array<int, string>|null  $gallery
     * @return list<string>
     */
    private function imagePaths(?string $cover, ?array $gallery): array
    {
        return array_values(array_filter([$cover, ...($gallery ?? [])]));
    }

    private function revalidateAfterResponse(): void
    {
        app()->terminating(fn () => $this->revalidator->projectsChanged());
    }
}
