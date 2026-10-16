<?php

namespace App\Models;

use Database\Factories\CourseLessonFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class CourseLesson extends Model
{
    /** @use HasFactory<CourseLessonFactory> */
    use HasFactory;

    protected $fillable = ['uuid', 'course_id', 'sort_order', 'title'];

    protected static function booted(): void
    {
        static::creating(function (CourseLesson $lesson): void {
            $lesson->uuid ??= (string) Str::uuid();
        });
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
