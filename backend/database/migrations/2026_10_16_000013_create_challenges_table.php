<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('challenges', function (Blueprint $table): void {
            $table->id();
            $table->string('slug')->unique();
            $table->string('mission_slug')->index();
            $table->string('title');
            $table->text('instruction');
            $table->text('starter_code')->nullable();
            $table->string('placeholder');
            $table->json('rules');
            $table->string('success_title');
            $table->text('success_description');
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('challenges'); }
};
