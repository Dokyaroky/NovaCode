<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCareerGoalRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return ['track_slug' => ['required', 'string', Rule::exists('career_tracks', 'slug')->where(fn ($query) => $query->where('active', true))]];
    }
}
