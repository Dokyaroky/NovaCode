<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_career_goals', function (Blueprint $table): void {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('career_track_id')->constrained()->restrictOnDelete();
            $table->boolean('is_current')->default(true);
            $table->timestamp('selected_at');
            $table->timestamps();
            $table->index(['user_id', 'is_current']);
        });
    }

    public function down(): void { Schema::dropIfExists('user_career_goals'); }
};
