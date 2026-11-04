<?php

namespace App\Providers;

use App\Models\Project;
use App\Observers\ProjectObserver;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Middleware\TrustProxies;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Model::preventSilentlyDiscardingAttributes(! $this->app->isProduction());

        Project::observe(ProjectObserver::class);

        RateLimiter::for('public-api', function (Request $request) {
            return Limit::perMinute(120)->by($request->ip());
        });

        RateLimiter::for('enquiries', function (Request $request) {
            return [
                Limit::perMinute(3)->by($request->ip()),
                Limit::perDay(20)->by($request->ip()),
            ];
        });

        Password::defaults(fn () => Password::min(12)->letters()->numbers()->mixedCase());

        if ($proxies = config('app.trusted_proxies')) {
            TrustProxies::at($proxies);
        }

        if ($this->app->isProduction()) {
            URL::forceScheme('https');
        }
    }
}
