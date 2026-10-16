<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\CourseLesson;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<CourseLesson> */
class CourseLessonFactory extends Factory
{
    protected $model = CourseLesson::class;

    public function definition(): array
    {
        return [
            'course_id' => Course::factory(),
            'sort_order' => fake()->unique()->numberBetween(1, 100),
            'title' => fake()->sentence(4),
        ];
    }
}
