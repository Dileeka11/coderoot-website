<?php

return [

    /*
    | The URL path of the admin panel. Moving it away from /admin cuts down on
    | automated login attempts. It is not a replacement for a strong password.
    */
    'path' => env('ADMIN_PATH', 'admin'),

    /*
    | Used once by `php artisan db:seed` to create the first admin account.
    | Remove ADMIN_PASSWORD from .env after the account exists.
    */
    'email' => env('ADMIN_EMAIL'),
    'password' => env('ADMIN_PASSWORD'),

];
