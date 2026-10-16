<?php

namespace App\Models;

use Database\Factories\UserMissionCompletionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserMissionCompletion extends Model
{
    /** @use HasFactory<UserMissionCompletionFactory> */
    use HasFactory;
    protected $fillable = ['user_id', 'career_track_mission_id', 'completed_at'];
    protected function casts(): array { return ['completed_at' => 'datetime']; }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function mission(): BelongsTo { return $this->belongsTo(CareerTrackMission::class, 'career_track_mission_id'); }
}
