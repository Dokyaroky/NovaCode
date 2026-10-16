<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChallengeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'instruction' => $this->instruction,
            'starterCode' => $this->starter_code,
            'placeholder' => $this->placeholder,
            'theory' => ['title' => $this->mission?->theory_title, 'minutes' => $this->mission?->theory_minutes],
            'passed' => (bool) $this->passed,
        ];
    }
}
