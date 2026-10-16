<?php

namespace Database\Factories;

use App\Models\Challenge;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Challenge> */
class ChallengeFactory extends Factory
{
    protected $model = Challenge::class;
    public function definition(): array
    {
        return ['slug' => fake()->unique()->slug(2), 'mission_slug' => fake()->slug(2), 'title' => fake()->sentence(3), 'instruction' => fake()->sentence(), 'starter_code' => null, 'placeholder' => 'Write your answer', 'rules' => [['all_of' => ['pass'], 'failure_title' => 'Not yet', 'failure_description' => 'Try again.']], 'success_title' => 'Accepted', 'success_description' => 'Passed.'];
    }
}
