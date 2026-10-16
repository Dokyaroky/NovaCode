<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\LessonProgressController;
use App\Http\Controllers\CareerController;
use App\Http\Controllers\ChallengeController;
use App\Http\Resources\UserResource;

Route::get('/health', fn () => response()->json([
    'status' => 'ok',
    'app' => config('app.name'),
    'time' => now()->toIso8601String(),
]));

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/user', fn (Request $request) => UserResource::make($request->user()))
    ->middleware('auth:sanctum');

Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{course:slug}', [CourseController::class, 'show']);
    Route::get('/course-categories', [CourseController::class, 'categories']);
    Route::get('/career-tracks', [CareerController::class, 'tracks']);
    Route::get('/me/career-goal', [CareerController::class, 'goal']);
    Route::put('/me/career-goal', [CareerController::class, 'updateGoal']);
    Route::get('/me/career-path', [CareerController::class, 'path']);
    Route::get('/me/missions/{missionSlug}/challenge', [ChallengeController::class, 'show']);
    Route::post('/challenges/{challenge:slug}/attempts', [ChallengeController::class, 'attempt'])->middleware('throttle:mission-attempts');
    Route::post('/courses/{course:slug}/enroll', [EnrollmentController::class, 'store']);
    Route::get('/me/enrollments', [EnrollmentController::class, 'index']);
    Route::get('/me/courses/{course:slug}', [EnrollmentController::class, 'show']);
    Route::post('/me/lessons/{lesson:uuid}/progress', [LessonProgressController::class, 'store']);
    Route::post('/me/lessons/{lesson:uuid}/complete', [LessonProgressController::class, 'complete']);
});
