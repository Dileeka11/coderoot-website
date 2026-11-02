<?php

namespace Database\Factories;

use App\Enums\ProjectCategory;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->unique()->words(3, true);

        return [
            'title' => Str::title($title),
            'slug' => Str::slug($title),
            'category' => fake()->randomElement(ProjectCategory::cases()),
            'summary' => fake()->sentence(10),
            'description' => fake()->paragraphs(2, true),
            'tech_stack' => ['Laravel', 'Next.js'],
            'cover_image' => 'projects/'.Str::random(40).'.webp',
            'gallery' => [],
            'is_published' => true,
            'published_at' => now(),
        ];
    }

    public function draft(): static
    {
        return $this->state(fn () => ['is_published' => false, 'published_at' => null]);
    }
}
