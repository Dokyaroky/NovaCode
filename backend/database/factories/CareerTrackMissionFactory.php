<?php

namespace Database\Factories;

use App\Models\CareerTrack;
use App\Models\CareerTrackMission;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<CareerTrackMission> */
class CareerTrackMissionFactory extends Factory
{
    protected $model = CareerTrackMission::class;
    public function definition(): array
    {
        $title = fake()->sentence(2);
        return ['career_track_id' => CareerTrack::factory(), 'slug' => fake()->unique()->slug(2), 'title' => $title, 'sort_order' => fake()->numberBetween(1, 3), 'theory_title' => "Theory: {$title}", 'theory_minutes' => 8, 'extraction_title' => "Fuel Extraction: {$title}", 'reward_label' => '+500 XP and 200L Plasma Fuel'];
    }
}
