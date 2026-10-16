<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseEnrollmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $total = (int) ($this->course?->lessons_count ?? $this->course?->lessons()->count() ?? 0);
        $completed = (int) ($this->completed_lessons_count ?? $this->lessonProgress()->where('status', 'completed')->count());

        return [
            'uuid' => $this->uuid,
            'status' => $this->status,
            'progress' => $total === 0 ? 0 : (int) round(($completed / $total) * 100),
            'started_at' => $this->started_at?->toIso8601String(),
            'last_active_at' => $this->last_active_at?->toIso8601String(),
            'completed_at' => $this->completed_at?->toIso8601String(),
            'course' => new CourseResource($this->whenLoaded('course')),
        ];
    }
}
