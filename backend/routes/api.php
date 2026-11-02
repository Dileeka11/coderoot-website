<?php

use App\Http\Controllers\Api\V1\ProjectController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')
    ->middleware(['throttle:public-api', 'cache.headers:public;max_age=60;etag'])
    ->group(function () {
        Route::get('projects', [ProjectController::class, 'index']);
        Route::get('projects/{slug}', [ProjectController::class, 'show'])
            ->where('slug', '[a-z0-9]+(?:-[a-z0-9]+)*');
    });
