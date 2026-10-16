<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLessonProgressRequest;
use App\Http\Requests\CompleteLessonRequest;
use App\Http\Resources\CourseEnrollmentResource;
use App\Http\Resources\LessonProgressResource;
use App\Models\CourseEnrollment;
use App\Models\CourseLesson;
use App\Models\LessonProgress;

class LessonProgressController extends Controller
{
    public function store(StoreLessonProgressRequest $request, CourseLesson $lesson): LessonProgressResource
    {
        $enrollment = $this->enrollment($request, $lesson);
        $progress = LessonProgress::firstOrNew(['course_enrollment_id' => $enrollment->id, 'course_lesson_id' => $lesson->id]);
        if ($progress->status !== 'completed') $progress->fill(['position_seconds' => $request->validated('position_seconds'), 'status' => 'in_progress']);
        $progress->save();
        $enrollment->update(['last_active_at' => now()]);
        return new LessonProgressResource($progress->load('lesson'));
    }

    public function complete(CompleteLessonRequest $request, CourseLesson $lesson): CourseEnrollmentResource
    {
        $enrollment = $this->enrollment($request, $lesson);
        $progress = LessonProgress::firstOrNew(['course_enrollment_id' => $enrollment->id, 'course_lesson_id' => $lesson->id]);
        if ($progress->status !== 'completed') {
            $progress->fill(['status' => 'completed', 'completed_at' => now()]);
            $progress->save();
        }
        $enrollment->update(['last_active_at' => now()]);
        $total = $enrollment->course->lessons()->count();
        $completed = $enrollment->lessonProgress()->where('status', 'completed')->count();
        if ($total > 0 && $completed === $total) $enrollment->update(['status' => 'completed', 'completed_at' => now()]);
        return new CourseEnrollmentResource($enrollment->fresh()->load(['course' => fn ($query) => $query->with('categories')->withCount('lessons')])->loadCount('lessonProgress as completed_lessons_count'));
    }

    private function enrollment(\Illuminate\Http\Request $request, CourseLesson $lesson): CourseEnrollment
    {
        return CourseEnrollment::query()->where('user_id', $request->user()->id)->where('course_id', $lesson->course_id)->firstOrFail();
    }
}
