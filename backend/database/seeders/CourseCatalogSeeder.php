<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseCategory;
use Illuminate\Database\Seeder;

class CourseCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $categories = collect([
            ['slug' => 'python', 'name' => 'Python'],
            ['slug' => 'react', 'name' => 'React'],
            ['slug' => 'javascript', 'name' => 'JavaScript'],
            ['slug' => 'data', 'name' => 'Data'],
        ])->mapWithKeys(function (array $attributes): array {
            $category = CourseCategory::updateOrCreate(
                ['slug' => $attributes['slug']],
                ['name' => $attributes['name']],
            );

            return [$category->slug => $category];
        });

        $courses = [
            [
                'slug' => 'python-foundations',
                'label' => 'Py',
                'label_bg' => 'bg-info',
                'xp' => '+500 XP',
                'level' => 'Beginner',
                'lessons' => 24,
                'title' => 'Python Foundations',
            ],
            [
                'slug' => 'react-from-scratch',
                'label' => 'Re',
                'label_bg' => 'bg-[#06b6d4]',
                'xp' => '+650 XP',
                'level' => 'Intermediate',
                'lessons' => 18,
                'title' => 'React From Scratch',
            ],
            [
                'slug' => 'javascript-algorithms',
                'label' => 'JS',
                'label_bg' => 'bg-[#eab308]',
                'xp' => '+800 XP',
                'level' => 'Intermediate',
                'lessons' => 32,
                'title' => 'JavaScript Algorithms',
            ],
            [
                'slug' => 'sql-data-modeling',
                'label' => 'DB',
                'label_bg' => 'bg-accent',
                'xp' => '+500 XP',
                'level' => 'Beginner',
                'lessons' => 20,
                'title' => 'SQL & Data Modeling',
            ],
            [
                'slug' => 'ai-with-python',
                'label' => 'AI',
                'label_bg' => 'bg-[#ec4899]',
                'xp' => '+900 XP',
                'level' => 'Advanced',
                'lessons' => 16,
                'title' => 'AI With Python',
            ],
            [
                'slug' => 'typescript-mastery',
                'label' => 'TS',
                'label_bg' => 'bg-[#2563eb]',
                'xp' => '+750 XP',
                'level' => 'Advanced',
                'lessons' => 22,
                'title' => 'TypeScript Mastery',
            ],
        ];

        foreach ($courses as $attributes) {
            $lessonCount = $attributes['lessons'];
            unset($attributes['lessons']);

            $course = Course::updateOrCreate(
                ['slug' => $attributes['slug']],
                $attributes,
            );

            $course->categories()->sync(
                collect($categories)
                    ->filter(fn (CourseCategory $category): bool => str_contains(
                        strtolower($course->title),
                        strtolower($category->name),
                    ))
                    ->pluck('id')
                    ->all(),
            );

            for ($position = 1; $position <= $lessonCount; $position++) {
                $course->lessons()->updateOrCreate(
                    ['sort_order' => $position],
                    ['title' => "Lesson {$position}"],
                );
            }
        }
    }
}
