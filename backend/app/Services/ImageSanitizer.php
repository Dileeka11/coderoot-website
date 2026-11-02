<?php

namespace App\Services;

use GdImage;
use RuntimeException;

/**
 * Rebuilds every uploaded image from its decoded pixels and saves it as WebP.
 *
 * Only pixels survive, so EXIF data (including GPS) and anything hidden inside the
 * original file are gone. SVG is not accepted because it can carry scripts.
 */
class ImageSanitizer
{
    public const MAX_WIDTH = 1600;

    public const QUALITY = 82;

    /** Stops decompression bombs: a small file that decodes to a huge bitmap. */
    private const MAX_PIXELS = 40_000_000;

    /**
     * @return string WebP bytes
     */
    public function toWebp(string $path): string
    {
        $info = @getimagesize($path);

        if ($info === false) {
            throw new RuntimeException('The file is not a readable image.');
        }

        [$width, $height, $type] = $info;

        if ($width * $height > self::MAX_PIXELS) {
            throw new RuntimeException('The image is too large.');
        }

        $image = match ($type) {
            IMAGETYPE_JPEG => @imagecreatefromjpeg($path),
            IMAGETYPE_PNG => @imagecreatefrompng($path),
            IMAGETYPE_WEBP => @imagecreatefromwebp($path),
            default => throw new RuntimeException('Only JPG, PNG and WebP images are allowed.'),
        };

        if (! $image instanceof GdImage) {
            throw new RuntimeException('The image could not be decoded.');
        }

        imagepalettetotruecolor($image);

        if ($type === IMAGETYPE_JPEG) {
            $image = $this->applyExifOrientation($image, $path);
        }

        $image = $this->fitToMaxWidth($image);

        imagealphablending($image, false);
        imagesavealpha($image, true);

        ob_start();
        $written = imagewebp($image, null, self::QUALITY);
        $bytes = ob_get_clean();

        if (! $written || $bytes === false || $bytes === '') {
            throw new RuntimeException('The image could not be converted.');
        }

        return $bytes;
    }

    private function applyExifOrientation(GdImage $image, string $path): GdImage
    {
        $exif = function_exists('exif_read_data') ? @exif_read_data($path) : false;

        $rotated = match ($exif['Orientation'] ?? 1) {
            3 => imagerotate($image, 180, 0),
            6 => imagerotate($image, -90, 0),
            8 => imagerotate($image, 90, 0),
            default => $image,
        };

        return $rotated instanceof GdImage ? $rotated : $image;
    }

    private function fitToMaxWidth(GdImage $image): GdImage
    {
        if (imagesx($image) <= self::MAX_WIDTH) {
            return $image;
        }

        $resized = imagescale($image, self::MAX_WIDTH, -1, IMG_BICUBIC);

        return $resized instanceof GdImage ? $resized : $image;
    }
}
