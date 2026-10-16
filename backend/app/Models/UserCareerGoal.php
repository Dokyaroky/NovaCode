<?php

namespace App\Models;

use Database\Factories\UserCareerGoalFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class UserCareerGoal extends Model
{
    /** @use HasFactory<UserCareerGoalFactory> */
    use HasFactory;
    protected $fillable = ['uuid', 'user_id', 'career_track_id', 'is_current', 'selected_at'];
    protected function casts(): array { return ['is_current' => 'boolean', 'selected_at' => 'datetime']; }
    protected static function booted(): void
    {
        static::creating(function (UserCareerGoal $goal): void { $goal->uuid ??= (string) Str::uuid(); });
    }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function track(): BelongsTo { return $this->belongsTo(CareerTrack::class, 'career_track_id'); }
}
