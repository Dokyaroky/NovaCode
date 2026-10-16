<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseCategoryCourse;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<CourseCategoryCourse> */
class CourseCategoryCourseFactory extends Factory
{
    protected $model = CourseCategoryCourse::class;

    public function definition(): array
    {
        return [
            'course_id' => Course::factory(),
            'course_category_id' => CourseCategory::factory(),
        ];
    }
}
