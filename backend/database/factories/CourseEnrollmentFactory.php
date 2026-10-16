<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<CourseEnrollment> */
class CourseEnrollmentFactory extends Factory
{
    protected $model = CourseEnrollment::class;

    public function definition(): array
    {
        return ['user_id' => User::factory(), 'course_id' => Course::factory(), 'status' => 'active', 'started_at' => now(), 'last_active_at' => now()];
    }
}
