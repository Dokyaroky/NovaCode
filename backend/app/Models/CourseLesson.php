<?php

namespace App\Models;

use Database\Factories\CourseLessonFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseLesson extends Model
{
    /** @use HasFactory<CourseLessonFactory> */
    use HasFactory;

    protected $fillable = ['course_id', 'sort_order', 'title'];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
