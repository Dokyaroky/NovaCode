<?php

namespace App\Models;

use Database\Factories\CourseEnrollmentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class CourseEnrollment extends Model
{
    /** @use HasFactory<CourseEnrollmentFactory> */
    use HasFactory;

    protected $fillable = ['uuid', 'user_id', 'course_id', 'status', 'started_at', 'last_active_at', 'completed_at'];

    protected function casts(): array
    {
        return ['started_at' => 'datetime', 'last_active_at' => 'datetime', 'completed_at' => 'datetime'];
    }

    protected static function booted(): void
    {
        static::creating(function (CourseEnrollment $enrollment): void {
            $enrollment->uuid ??= (string) Str::uuid();
        });
    }

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function course(): BelongsTo { return $this->belongsTo(Course::class); }
    public function lessonProgress(): HasMany { return $this->hasMany(LessonProgress::class); }
}
