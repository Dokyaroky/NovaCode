<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('career_tracks', function (Blueprint $table): void {
            $table->unsignedTinyInteger('sort_order')->nullable()->after('description');
        });
        foreach (['full-stack', 'front-end', 'back-end', 'cybersecurity', 'data-scientist', 'ai-engineer'] as $index => $slug) {
            DB::table('career_tracks')->where('slug', $slug)->update(['sort_order' => $index + 1]);
        }
        Schema::table('career_tracks', function (Blueprint $table): void {
            $table->unsignedTinyInteger('sort_order')->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('career_tracks', function (Blueprint $table): void { $table->dropColumn('sort_order'); });
    }
};
