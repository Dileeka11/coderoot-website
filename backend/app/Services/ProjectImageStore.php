<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectImageStore
{
    public const DIRECTORY = 'projects';

    public function __construct(private readonly ImageSanitizer $sanitizer) {}

    /**
     * @return string Path on the public disk. The name is random, so nothing from the upload reaches the filesystem.
     */
    public function store(string $sourcePath): string
    {
        $path = self::DIRECTORY.'/'.Str::random(40).'.webp';

        Storage::disk('public')->put($path, $this->sanitizer->toWebp($sourcePath));

        return $path;
    }

    /**
     * Form values can be edited in the browser, so paths are checked against what store() produces.
     */
    public static function isStoredPath(string $path): bool
    {
        return preg_match('#^'.self::DIRECTORY.'/[A-Za-z0-9]+\.webp$#', $path) === 1;
    }

    /**
     * @param  iterable<string>  $paths
     */
    public function delete(iterable $paths): void
    {
        foreach ($paths as $path) {
            if (self::isStoredPath($path)) {
                Storage::disk('public')->delete($path);
            }
        }
    }
}
