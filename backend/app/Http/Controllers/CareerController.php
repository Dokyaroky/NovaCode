<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateCareerGoalRequest;
use App\Http\Resources\CareerPathResource;
use App\Http\Resources\CareerTrackResource;
use App\Http\Resources\UserCareerGoalResource;
use App\Models\CareerTrack;
use App\Models\Challenge;
use App\Models\User;
use App\Models\UserCareerGoal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CareerController extends Controller
{
    public function tracks()
    {
        return CareerTrackResource::collection(CareerTrack::query()->where('active', true)->orderBy('sort_order')->get());
    }

    public function goal(Request $request): JsonResponse
    {
        $goal = UserCareerGoal::query()->where('user_id', $request->user()->id)->where('is_current', true)->with('track')->first();
        return response()->json(['data' => $goal ? (new UserCareerGoalResource($goal))->resolve() : null]);
    }

    public function updateGoal(UpdateCareerGoalRequest $request): UserCareerGoalResource
    {
        $track = CareerTrack::query()->where('slug', $request->validated('track_slug'))->where('active', true)->firstOrFail();
        $goal = DB::transaction(function () use ($request, $track): UserCareerGoal {
            User::query()->whereKey($request->user()->id)->lockForUpdate()->firstOrFail();
            $current = UserCareerGoal::query()->where('user_id', $request->user()->id)->where('is_current', true)->with('track')->lockForUpdate()->first();
            if ($current?->career_track_id === $track->id) return $current;
            UserCareerGoal::query()->where('user_id', $request->user()->id)->where('is_current', true)->update(['is_current' => false]);
            return UserCareerGoal::create(['user_id' => $request->user()->id, 'career_track_id' => $track->id, 'is_current' => true, 'selected_at' => now()])->load('track');
        });
        return new UserCareerGoalResource($goal);
    }

    public function path(Request $request): CareerPathResource|JsonResponse
    {
        $goal = UserCareerGoal::query()->where('user_id', $request->user()->id)->where('is_current', true)->with(['track.missions'])->first();
        if (! $goal) return response()->json(['message' => 'Choose a career goal before viewing your career path.'], 409);

        $missions = $goal->track->missions;
        $challengeSlugs = Challenge::query()->whereIn('mission_slug', $missions->pluck('slug'))->pluck('mission_slug')->all();
        $completedIds = $request->user()->missionCompletions()->whereIn('career_track_mission_id', $missions->modelKeys())->pluck('career_track_mission_id')->all();
        $firstUnfinished = $missions->search(fn ($mission) => ! in_array($mission->id, $completedIds, true));
        $missionData = $missions->values()->map(function ($mission, int $index) use ($completedIds, $firstUnfinished, $challengeSlugs): array {
            $finished = in_array($mission->id, $completedIds, true);
            return ['slug' => $mission->slug, 'title' => $mission->title, 'sortOrder' => $mission->sort_order, 'status' => $finished ? 'finished' : ($index === $firstUnfinished ? 'extracting' : 'locked'), 'hasChallenge' => in_array($mission->slug, $challengeSlugs, true)];
        })->all();
        $finishedCount = count($completedIds);
        $activeMission = $firstUnfinished === false ? $missions->last() : $missions->get($firstUnfinished);
        $allFinished = $finishedCount === $missions->count();
        $activeHasChallenge = $activeMission && in_array($activeMission->slug, $challengeSlugs, true);

        return new CareerPathResource([
            'track' => ['slug' => $goal->track->slug, 'title' => $goal->track->title, 'description' => $goal->track->description],
            'missions' => $missionData,
            'fuelPercent' => $missions->count() === 0 ? 0 : (int) round(($finishedCount / $missions->count()) * 100),
            'boss' => ['title' => $goal->track->boss_title, 'rewardLabel' => $goal->track->boss_reward_label, 'locked' => ! $allFinished],
            'briefing' => $activeMission ? ['title' => $activeMission->title, 'missionSlug' => $activeMission->slug, 'hasChallenge' => $activeHasChallenge, 'theoryTitle' => $activeMission->theory_title, 'theoryMinutes' => $activeMission->theory_minutes, 'extractionTitle' => $activeMission->extraction_title, 'rewardLabel' => $activeMission->reward_label] : null,
        ]);
    }
}
