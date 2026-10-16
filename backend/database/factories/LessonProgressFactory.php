<?php

namespace Database\Factories;

use App\Models\CourseEnrollment;
use App\Models\CourseLesson;
use App\Models\LessonProgress;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<LessonProgress> */
class LessonProgressFactory extends Factory
{
    protected $model = LessonProgress::class;

    public function definition(): array
    {
        return ['course_enrollment_id' => CourseEnrollment::factory(), 'course_lesson_id' => CourseLesson::factory(), 'position_seconds' => 0, 'status' => 'in_progress'];
    }
}
