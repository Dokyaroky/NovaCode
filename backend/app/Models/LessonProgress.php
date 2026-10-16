<?php

namespace App\Models;

use Database\Factories\LessonProgressFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class LessonProgress extends Model
{
    /** @use HasFactory<LessonProgressFactory> */
    use HasFactory;

    protected $fillable = ['uuid', 'course_enrollment_id', 'course_lesson_id', 'position_seconds', 'status', 'completed_at'];

    protected function casts(): array
    {
        return ['completed_at' => 'datetime'];
    }

    protected static function booted(): void
    {
        static::creating(function (LessonProgress $progress): void {
            $progress->uuid ??= (string) Str::uuid();
        });
    }

    public function enrollment(): BelongsTo { return $this->belongsTo(CourseEnrollment::class, 'course_enrollment_id'); }
    public function lesson(): BelongsTo { return $this->belongsTo(CourseLesson::class, 'course_lesson_id'); }
}
