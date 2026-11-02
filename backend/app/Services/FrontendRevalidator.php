<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Tells the Next.js site that project data changed so new work shows up without a rebuild.
 * The site also refreshes itself on a timer, so a failed call here is only logged.
 */
class FrontendRevalidator
{
    public function projectsChanged(): void
    {
        $url = config('services.frontend.url');
        $secret = config('services.frontend.revalidate_secret');

        if (! $url || ! $secret) {
            return;
        }

        try {
            Http::timeout(3)
                ->withHeaders(['x-revalidate-secret' => $secret])
                ->post(rtrim($url, '/').'/api/revalidate')
                ->throw();
        } catch (Throwable $e) {
            Log::warning('Frontend revalidation failed: '.$e->getMessage());
        }
    }
}
