<?php

namespace App\Http\Controllers;

use App\Http\Requests\CourseIndexRequest;
use App\Http\Resources\CourseCategoryResource;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use App\Models\CourseCategory;

class CourseController extends Controller
{
    public function index(CourseIndexRequest $request)
    {
        $courses = Course::query()
            ->with('categories')
            ->withCount('lessons')
            ->when($request->validated('search'), function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query
                        ->where('title', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%")
                        ->orWhere('label', 'like', "%{$search}%");
                });
            })
            ->when($request->validated('category'), function ($query, string $category): void {
                $query->whereHas('categories', fn ($categoryQuery) => $categoryQuery->where('slug', $category));
            })
            ->orderBy('title')
            ->get();

        return CourseResource::collection($courses)->additional([
            'meta' => ['total' => $courses->count()],
        ]);
    }

    public function show(Course $course): CourseResource
    {
        return new CourseResource($course->load(['categories', 'lessons'])->loadCount('lessons'));
    }

    public function categories()
    {
        return CourseCategoryResource::collection(CourseCategory::query()->orderBy('name')->get());
    }
}
