<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title', 120);
            $table->string('slug', 140)->unique();
            $table->string('category', 30)->index();
            $table->string('client_name', 120)->nullable();
            $table->string('summary', 200);
            $table->text('description');
            $table->json('tech_stack')->nullable();
            $table->string('cover_image');
            $table->json('gallery')->nullable();
            $table->string('live_url', 2048)->nullable();
            $table->unsignedSmallInteger('completed_year')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(false)->index();
            $table->timestamp('published_at')->nullable();
            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
