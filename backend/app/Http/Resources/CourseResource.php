<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'label' => $this->label,
            'labelBg' => $this->label_bg,
            'xp' => $this->xp,
            'level' => $this->level,
            'lessons' => (int) $this->lessons_count,
            'categories' => CourseCategoryResource::collection($this->whenLoaded('categories')),
        ];
    }
}
