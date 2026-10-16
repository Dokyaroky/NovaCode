<?php

namespace App\Http\Controllers;

use App\Http\Requests\EnrollCourseRequest;
use App\Http\Resources\CourseEnrollmentResource;
use App\Models\Course;
use App\Models\CourseEnrollment;
use Illuminate\Http\Response;

class EnrollmentController extends Controller
{
    public function store(EnrollCourseRequest $request, Course $course): CourseEnrollmentResource
    {
        $enrollment = CourseEnrollment::firstOrCreate(
            ['user_id' => $request->user()->id, 'course_id' => $course->id],
            ['status' => 'active', 'started_at' => now(), 'last_active_at' => now()],
        );

        return new CourseEnrollmentResource($this->withCourse($enrollment));
    }

    public function index(EnrollCourseRequest $request)
    {
        $enrollments = $this->owned($request)->with($this->courseWithLessons())->withCount('lessonProgress as completed_lessons_count')->orderByDesc('last_active_at')->orderByDesc('started_at')->get();
        return CourseEnrollmentResource::collection($enrollments);
    }

    public function show(EnrollCourseRequest $request, Course $course): CourseEnrollmentResource
    {
        $enrollment = $this->owned($request)->where('course_id', $course->id)->with($this->courseWithLessons())->withCount('lessonProgress as completed_lessons_count')->firstOrFail();
        return new CourseEnrollmentResource($enrollment);
    }

    private function owned(EnrollCourseRequest $request)
    {
        return CourseEnrollment::query()->where('user_id', $request->user()->id);
    }

    private function withCourse(CourseEnrollment $enrollment): CourseEnrollment
    {
        return $enrollment->load($this->courseWithLessons())->loadCount('lessonProgress as completed_lessons_count');
    }

    private function courseWithLessons(): array
    {
        return ['course' => fn ($query) => $query->with('categories')->withCount('lessons')];
    }
}
