<?php

use App\Http\Controllers\Api\V1\EnquiryController;
use App\Http\Controllers\Api\V1\ProjectController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')
    ->middleware(['throttle:public-api', 'cache.headers:public;max_age=60;etag'])
    ->group(function () {
        Route::get('projects', [ProjectController::class, 'index']);
        Route::get('projects/{slug}', [ProjectController::class, 'show'])
            ->where('slug', '[a-z0-9]+(?:-[a-z0-9]+)*');
    });

// The quote and contact forms. Emailed to the company inbox, never stored.
Route::post('v1/enquiries', [EnquiryController::class, 'store'])->middleware('throttle:enquiries');
