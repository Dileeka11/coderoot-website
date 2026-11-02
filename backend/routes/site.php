<?php

use App\Http\Controllers\ProjectPageController;
use Illuminate\Support\Facades\Route;

/*
 * Pages of the public site that Laravel serves, because they change whenever a project is added.
 * They sit outside the web middleware, so visitors get no session or cookies.
 */
Route::middleware('throttle:public-api')->name('site.')->group(function () {
    Route::get('projects/{slug}', [ProjectPageController::class, 'show'])
        ->where('slug', '[a-z0-9]+(?:-[a-z0-9]+)*')
        ->name('project');
    Route::get('projects-sitemap.xml', [ProjectPageController::class, 'sitemap'])->name('sitemap');
});
