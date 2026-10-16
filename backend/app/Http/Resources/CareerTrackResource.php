<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CareerTrackResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return ['slug' => $this->slug, 'title' => $this->title, 'description' => $this->description];
    }
}
