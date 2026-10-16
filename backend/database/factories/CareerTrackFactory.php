<?php

namespace Database\Factories;

use App\Models\CareerTrack;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<CareerTrack> */
class CareerTrackFactory extends Factory
{
    protected $model = CareerTrack::class;
    public function definition(): array
    {
        return ['slug' => fake()->unique()->slug(2), 'title' => fake()->sentence(2), 'description' => fake()->sentence(), 'sort_order' => fake()->numberBetween(1, 255), 'boss_title' => 'Final Boss: Capstone', 'boss_reward_label' => '10,000L Rocket Fuel', 'active' => true];
    }
}
