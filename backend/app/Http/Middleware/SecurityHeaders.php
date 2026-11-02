<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    private const API_CSP = "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'";

    /**
     * Filament is built on Livewire and Alpine, which need inline scripts and eval.
     * Everything else stays locked to this origin.
     */
    private const ADMIN_CSP = "default-src 'self'; "
        ."script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
        ."style-src 'self' 'unsafe-inline'; "
        ."img-src 'self' data: blob:; "
        ."font-src 'self' data:; "
        ."connect-src 'self'; "
        ."worker-src 'self' blob:; "
        ."object-src 'none'; "
        ."base-uri 'self'; "
        ."form-action 'self'; "
        ."frame-ancestors 'none'";

    /** The same policy as the public site's own pages. Keep it in step with deploy/public.htaccess. */
    private const SITE_CSP = "default-src 'self'; "
        ."script-src 'self' 'unsafe-inline'; "
        ."style-src 'self' 'unsafe-inline'; "
        ."img-src 'self' data: blob:; "
        ."font-src 'self'; "
        ."connect-src 'self'; "
        ."object-src 'none'; "
        ."base-uri 'self'; "
        ."form-action 'self'; "
        ."frame-ancestors 'none'; "
        ."manifest-src 'self'; "
        .'upgrade-insecure-requests';

    public function handle(Request $request, Closure $next): Response
    {
        /** @var Response $response */
        $response = $next($request);

        // Project pages and the project sitemap belong to the public site, so search engines may read them.
        $isSitePage = $request->routeIs('site.*');

        $headers = $response->headers;
        $headers->set('X-Content-Type-Options', 'nosniff');
        $headers->set('X-Frame-Options', 'DENY');
        $headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
        $headers->set('Cross-Origin-Opener-Policy', 'same-origin');
        $headers->set('Cross-Origin-Resource-Policy', 'same-site');
        $headers->set('Content-Security-Policy', match (true) {
            $isSitePage => self::SITE_CSP,
            $request->is('api/*') => self::API_CSP,
            default => self::ADMIN_CSP,
        });

        if (! $isSitePage) {
            $headers->set('X-Robots-Tag', 'noindex, nofollow');
        }

        // Without includeSubDomains, because other sites live on subdomains of the same domain.
        if ($request->isSecure()) {
            $headers->set('Strict-Transport-Security', 'max-age=31536000');
        }

        $headers->remove('X-Powered-By');
        header_remove('X-Powered-By');

        return $response;
    }
}
