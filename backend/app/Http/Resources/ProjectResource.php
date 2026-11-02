<?php

namespace App\Http\Resources;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Project
 */
class ProjectResource extends JsonResource
{
    /**
     * Fields are listed one by one so a new database column is never exposed by accident.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'category' => [
                'value' => $this->category->value,
                'label' => $this->category->getLabel(),
            ],
            'client' => $this->client_name,
            'summary' => $this->summary,
            'tech_stack' => $this->tech_stack ?? [],
            'cover' => $this->cover_image,
            'live_url' => $this->live_url,
            'year' => $this->completed_year,
            'featured' => $this->is_featured,
            'published_at' => $this->published_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'description' => $this->when($request->route('slug') !== null, $this->description),
            'gallery' => $this->when($request->route('slug') !== null, fn () => $this->gallery ?? []),
        ];
    }
}
