<?php

namespace App\Filament\Resources\Projects\Schemas;

use App\Enums\ProjectCategory;
use App\Services\ProjectImageStore;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;
use RuntimeException;

class ProjectForm
{
    /** SVG is left out because it can carry scripts. */
    private const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    private const MAX_IMAGE_KB = 5120;

    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(3)
            ->components([
                Section::make('Project details')
                    ->columnSpan(['default' => 3, 'lg' => 2])
                    ->columns(2)
                    ->schema([
                        TextInput::make('title')
                            ->required()
                            ->maxLength(120)
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (Get $get, Set $set, ?string $state): void {
                                if (blank($get('slug'))) {
                                    $set('slug', Str::slug((string) $state));
                                }
                            }),
                        TextInput::make('slug')
                            ->label('Page address')
                            ->required()
                            ->maxLength(140)
                            ->unique(ignoreRecord: true)
                            ->rule('regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/')
                            ->prefix('/projects/')
                            ->helperText('Lowercase letters, numbers and dashes. Changing it changes the public link.'),
                        Select::make('category')
                            ->options(ProjectCategory::class)
                            ->required(),
                        TextInput::make('client_name')
                            ->label('Client name')
                            ->maxLength(120)
                            ->helperText('Leave empty if the client should not be named.'),
                        Textarea::make('summary')
                            ->required()
                            ->maxLength(200)
                            ->rows(2)
                            ->columnSpanFull()
                            ->helperText('One or two lines. Shown on the project card and in Google results.'),
                        Textarea::make('description')
                            ->required()
                            ->maxLength(10000)
                            ->rows(10)
                            ->columnSpanFull()
                            ->helperText('Plain text. Leave an empty line between paragraphs.'),
                        TagsInput::make('tech_stack')
                            ->label('Technologies')
                            ->placeholder('Type and press Enter')
                            ->nestedRecursiveRules(['string', 'max:40'])
                            ->columnSpanFull(),
                        TextInput::make('live_url')
                            ->label('Live website')
                            ->placeholder('https://')
                            ->maxLength(2048)
                            ->rule('url:http,https'),
                        TextInput::make('completed_year')
                            ->label('Year completed')
                            ->integer()
                            ->minValue(2000)
                            ->maxValue((int) date('Y') + 1),
                    ]),

                Section::make('Publishing')
                    ->columnSpan(['default' => 3, 'lg' => 1])
                    ->schema([
                        Toggle::make('is_published')
                            ->label('Published')
                            ->helperText('Drafts stay hidden from the website.'),
                        Toggle::make('is_featured')
                            ->label('Featured')
                            ->helperText('Featured projects appear first.'),
                        self::imageUpload('cover_image')
                            ->label('Cover image')
                            ->required()
                            ->helperText('JPG, PNG or WebP, up to 5 MB. A 16:10 image of at least 1600px wide looks best.'),
                        self::imageUpload('gallery')
                            ->label('More images')
                            ->multiple()
                            ->reorderable()
                            ->maxFiles(8)
                            ->helperText('Optional. Up to 8 images.'),
                    ]),
            ]);
    }

    /**
     * Every upload is rebuilt as a clean WebP under a random name before it is stored.
     */
    private static function imageUpload(string $name): FileUpload
    {
        return FileUpload::make($name)
            ->image()
            ->acceptedFileTypes(self::IMAGE_TYPES)
            ->maxSize(self::MAX_IMAGE_KB)
            ->disk('public')
            ->directory(ProjectImageStore::DIRECTORY)
            ->visibility('public')
            ->saveUploadedFileUsing(function (TemporaryUploadedFile $file) use ($name): string {
                try {
                    return app(ProjectImageStore::class)->store($file->getRealPath());
                } catch (RuntimeException $e) {
                    throw ValidationException::withMessages(["data.{$name}" => $e->getMessage()]);
                }
            });
    }
}
