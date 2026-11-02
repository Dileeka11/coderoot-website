<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum ProjectCategory: string implements HasLabel
{
    case Website = 'website';
    case WebApp = 'web_app';
    case CustomSoftware = 'custom_software';

    public function getLabel(): string
    {
        return match ($this) {
            self::Website => 'Website',
            self::WebApp => 'Web app',
            self::CustomSoftware => 'Custom software',
        };
    }
}
