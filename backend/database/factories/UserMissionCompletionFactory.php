<?php

namespace Database\Factories;

use App\Models\CareerTrackMission;
use App\Models\User;
use App\Models\UserMissionCompletion;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<UserMissionCompletion> */
class UserMissionCompletionFactory extends Factory
{
    protected $model = UserMissionCompletion::class;
    public function definition(): array { return ['user_id' => User::factory(), 'career_track_mission_id' => CareerTrackMission::factory(), 'completed_at' => now()]; }
}
