<?php

namespace Database\Factories;

use App\Models\Challenge;
use App\Models\ChallengeAttempt;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<ChallengeAttempt> */
class ChallengeAttemptFactory extends Factory
{
    protected $model = ChallengeAttempt::class;
    public function definition(): array { return ['user_id' => User::factory(), 'challenge_id' => Challenge::factory(), 'answer' => 'answer', 'passed' => false, 'failure_title' => 'Not yet']; }
}
