<?php

namespace App\Models;

use Database\Factories\CareerTrackFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CareerTrack extends Model
{
    /** @use HasFactory<CareerTrackFactory> */
    use HasFactory;

    protected $fillable = ['slug', 'title', 'description', 'sort_order', 'boss_title', 'boss_reward_label', 'active'];
    protected function casts(): array { return ['active' => 'boolean']; }
    public function missions(): HasMany { return $this->hasMany(CareerTrackMission::class)->orderBy('sort_order'); }
    public function goals(): HasMany { return $this->hasMany(UserCareerGoal::class); }
}
