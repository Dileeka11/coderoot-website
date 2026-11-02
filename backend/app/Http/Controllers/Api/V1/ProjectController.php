<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProjectController extends Controller
{
    private const LIST_LIMIT = 100;

    public function index(): AnonymousResourceCollection
    {
        return ProjectResource::collection(
            Project::query()->published()->forDisplay()->limit(self::LIST_LIMIT)->get()
        );
    }

    public function show(string $slug): ProjectResource
    {
        return new ProjectResource(
            Project::query()->published()->where('slug', $slug)->firstOrFail()
        );
    }
}
