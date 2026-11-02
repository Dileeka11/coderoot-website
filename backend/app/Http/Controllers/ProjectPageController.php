<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Response;

/**
 * The public site is plain files built ahead of time, so a project added later has no page of
 * its own. This serves the shared project page with that project's title, description, share
 * image and canonical link written into the head, for link previews and crawlers that do not
 * run JavaScript. In browsers, ProjectView sets the title and description again once React starts.
 */
class ProjectPageController extends Controller
{
    private const SITE_NAME = 'CodeRoot Solutions';

    /** Tags in the shared page that describe "a project" in general, replaced with this project's own. */
    private const GENERIC_TAGS = '#<title>.*?</title>|<meta (?:name|property)="(?:description|robots|og:[^"]*|twitter:[^"]*)"[^>]*/?>|<link rel="canonical"[^>]*/?>#s';

    public function show(string $slug): Response
    {
        $shell = $this->buildFile('projects/item.html');
        $project = Project::query()->published()->where('slug', $slug)->first();

        if (! $project || ! is_file($shell)) {
            $notFound = $this->buildFile('404.html');

            return $this->html(is_file($notFound) ? (string) file_get_contents($notFound) : 'Not found', 404);
        }

        $page = preg_replace(self::GENERIC_TAGS, '', (string) file_get_contents($shell));
        $page = preg_replace('#</head>#', $this->head($project).'</head>', (string) $page, 1);

        return $this->html((string) $page, 200);
    }

    public function sitemap(): Response
    {
        $site = $this->siteUrl();
        $urls = Project::query()->published()->forDisplay()->get(['slug', 'updated_at'])
            ->map(fn (Project $project) => '<url><loc>'.e("{$site}/projects/{$project->slug}").'</loc>'
                .($project->updated_at ? '<lastmod>'.$project->updated_at->toAtomString().'</lastmod>' : '')
                .'</url>')
            ->implode('');

        return response('<?xml version="1.0" encoding="UTF-8"?>'
            .'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'.$urls.'</urlset>', 200, [
                'Content-Type' => 'application/xml; charset=UTF-8',
                'Cache-Control' => 'public, max-age=3600',
            ]);
    }

    private function head(Project $project): string
    {
        $site = $this->siteUrl();
        $url = "{$site}/projects/{$project->slug}";
        $title = "{$project->title} | ".self::SITE_NAME;
        $image = $site.'/media/'.implode('/', array_map('rawurlencode', explode('/', $project->cover_image)));

        $tags = [
            '<title>'.e($title).'</title>',
            '<meta name="description" content="'.e($project->summary).'"/>',
            '<link rel="canonical" href="'.e($url).'"/>',
            '<meta property="og:type" content="article"/>',
            '<meta property="og:site_name" content="'.self::SITE_NAME.'"/>',
            '<meta property="og:locale" content="en_LK"/>',
            '<meta property="og:title" content="'.e($title).'"/>',
            '<meta property="og:description" content="'.e($project->summary).'"/>',
            '<meta property="og:url" content="'.e($url).'"/>',
            '<meta property="og:image" content="'.e($image).'"/>',
            '<meta property="og:image:alt" content="'.e($project->title).'"/>',
            '<meta name="twitter:card" content="summary_large_image"/>',
            '<meta name="twitter:title" content="'.e($title).'"/>',
            '<meta name="twitter:description" content="'.e($project->summary).'"/>',
            '<meta name="twitter:image" content="'.e($image).'"/>',
        ];

        return implode('', $tags);
    }

    /** A file from the built site, which sits next to Laravel on the live server. */
    private function buildFile(string $path): string
    {
        $folder = config('services.frontend.build_path');

        return $folder ? base_path(trim($folder, '/').'/'.$path) : public_path($path);
    }

    private function siteUrl(): string
    {
        return rtrim((string) (config('services.frontend.url') ?: config('app.url')), '/');
    }

    private function html(string $body, int $status): Response
    {
        return response($body, $status, [
            'Content-Type' => 'text/html; charset=UTF-8',
            'Cache-Control' => 'public, max-age=300',
        ]);
    }
}
