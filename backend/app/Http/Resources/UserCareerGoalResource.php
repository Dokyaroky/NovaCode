<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserCareerGoalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return ['uuid' => $this->uuid, 'isCurrent' => $this->is_current, 'selectedAt' => $this->selected_at?->toIso8601String(), 'track' => new CareerTrackResource($this->whenLoaded('track'))];
    }
}
