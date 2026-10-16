<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreChallengeAttemptRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array { return ['answer' => ['present', 'nullable', 'string', 'max:5000']]; }
}
