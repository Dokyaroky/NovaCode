<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('career_track_missions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('career_track_id')->constrained()->cascadeOnDelete();
            $table->string('slug');
            $table->string('title');
            $table->unsignedTinyInteger('sort_order');
            $table->string('theory_title');
            $table->unsignedSmallInteger('theory_minutes');
            $table->string('extraction_title');
            $table->string('reward_label');
            $table->timestamps();
            $table->unique(['career_track_id', 'slug']);
            $table->unique(['career_track_id', 'sort_order']);
        });
    }

    public function down(): void { Schema::dropIfExists('career_track_missions'); }
};
