<?php

namespace Database\Factories;

use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Course> */
class CourseFactory extends Factory
{
    protected $model = Course::class;

    public function definition(): array
    {
        $title = fake()->sentence(3);

        return [
            'slug' => fake()->unique()->slug(3),
            'title' => $title,
            'label' => strtoupper(substr($title, 0, 2)),
            'label_bg' => 'bg-info',
            'xp' => '+500 XP',
            'level' => 'Beginner',
        ];
    }
}
