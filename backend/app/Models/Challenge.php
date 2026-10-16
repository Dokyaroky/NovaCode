<?php

namespace App\Models;

use Database\Factories\ChallengeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Challenge extends Model
{
    /** @use HasFactory<ChallengeFactory> */
    use HasFactory;
    protected $fillable = ['slug', 'mission_slug', 'title', 'instruction', 'starter_code', 'placeholder', 'rules', 'success_title', 'success_description'];
    protected function casts(): array { return ['rules' => 'array']; }
    public function attempts(): HasMany { return $this->hasMany(ChallengeAttempt::class); }
    public function mission(): BelongsTo { return $this->belongsTo(CareerTrackMission::class, 'mission_slug', 'slug'); }
}
