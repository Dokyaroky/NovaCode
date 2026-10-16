<?php

namespace App\Models;

use Database\Factories\CourseCategoryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CourseCategory extends Model
{
    /** @use HasFactory<CourseCategoryFactory> */
    use HasFactory;

    protected $fillable = ['slug', 'name'];

    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'course_category_course')
            ->using(CourseCategoryCourse::class);
    }
}
