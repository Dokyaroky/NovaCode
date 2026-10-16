<?php

namespace Database\Factories;

use App\Models\CareerTrack;
use App\Models\User;
use App\Models\UserCareerGoal;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<UserCareerGoal> */
class UserCareerGoalFactory extends Factory
{
    protected $model = UserCareerGoal::class;
    public function definition(): array { return ['user_id' => User::factory(), 'career_track_id' => CareerTrack::factory(), 'is_current' => true, 'selected_at' => now()]; }
}
