<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class CourseCategoryCourse extends Pivot
{
    public $timestamps = false;

    protected $table = 'course_category_course';

    protected $fillable = ['course_id', 'course_category_id'];
}
