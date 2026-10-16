<?php

namespace App\Models;

use Database\Factories\ChallengeAttemptFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class ChallengeAttempt extends Model
{
    /** @use HasFactory<ChallengeAttemptFactory> */
    use HasFactory;
    public $timestamps = false;
    protected $fillable = ['uuid', 'user_id', 'challenge_id', 'answer', 'passed', 'failure_title', 'created_at'];
    protected function casts(): array { return ['passed' => 'boolean', 'created_at' => 'datetime']; }
    protected static function booted(): void
    {
        static::creating(function (ChallengeAttempt $attempt): void { $attempt->uuid ??= (string) Str::uuid(); $attempt->created_at ??= now(); });
    }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function challenge(): BelongsTo { return $this->belongsTo(Challenge::class); }
}
