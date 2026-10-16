<?php

namespace Database\Factories;

use App\Models\CourseCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<CourseCategory> */
class CourseCategoryFactory extends Factory
{
    protected $model = CourseCategory::class;

    public function definition(): array
    {
        $name = fake()->unique()->word();

        return [
            'slug' => str($name)->slug()->toString(),
            'name' => ucfirst($name),
        ];
    }
}
