<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LessonProgressResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return ['uuid' => $this->uuid, 'lessonUuid' => $this->lesson?->uuid, 'positionSeconds' => $this->position_seconds, 'status' => $this->status, 'completedAt' => $this->completed_at?->toIso8601String()];
    }
}
