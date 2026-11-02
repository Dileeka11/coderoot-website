<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use RuntimeException;

class DatabaseSeeder extends Seeder
{
    /**
     * Creates the first admin account from ADMIN_EMAIL and ADMIN_PASSWORD.
     * There is no default password on purpose, and no sample projects: the site only shows real work.
     */
    public function run(): void
    {
        $email = config('admin.email');
        $password = config('admin.password');

        if (User::where('email', $email)->exists()) {
            $this->command?->info('Admin account already exists, nothing to do.');

            return;
        }

        if (! $email || ! $password || strlen($password) < 16) {
            throw new RuntimeException('Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 16 characters in .env first.');
        }

        $user = new User(['name' => 'CodeRoot Admin', 'email' => $email, 'password' => $password]);
        $user->is_admin = true;
        $user->save();

        $this->command?->info('Admin account created.');
    }
}
