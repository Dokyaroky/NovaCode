<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('challenge_attempts', function (Blueprint $table): void {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('challenge_id')->constrained()->cascadeOnDelete();
            $table->text('answer');
            $table->boolean('passed');
            $table->string('failure_title')->nullable();
            $table->timestamp('created_at');
            $table->index(['user_id', 'challenge_id']);
        });
    }

    public function down(): void { Schema::dropIfExists('challenge_attempts'); }
};
