<?php

namespace App\Models;

use Database\Factories\CareerTrackMissionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CareerTrackMission extends Model
{
    /** @use HasFactory<CareerTrackMissionFactory> */
    use HasFactory;
    protected $fillable = ['career_track_id', 'slug', 'title', 'sort_order', 'theory_title', 'theory_minutes', 'extraction_title', 'reward_label'];
    public function track(): BelongsTo { return $this->belongsTo(CareerTrack::class, 'career_track_id'); }
    public function completions(): HasMany { return $this->hasMany(UserMissionCompletion::class); }
}
