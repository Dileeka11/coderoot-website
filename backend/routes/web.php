<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $frontend = config('services.frontend.url');

    return $frontend ? redirect()->away($frontend) : response()->noContent();
});
