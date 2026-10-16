<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreChallengeAttemptRequest;
use App\Http\Resources\ChallengeResource;
use App\Models\CareerTrackMission;
use App\Models\Challenge;
use App\Models\ChallengeAttempt;
use App\Models\UserCareerGoal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChallengeController extends Controller
{
    public function show(Request $request, string $missionSlug): ChallengeResource
    {
        [$mission, $missions, $completedIds] = $this->context($request, $missionSlug);
        $challenge = Challenge::query()->where('mission_slug', $mission->slug)->with('mission')->firstOrFail();
        $this->ensureUnlocked($mission, $missions, $completedIds);
        $passed = in_array($mission->id, $completedIds, true);
        $challenge->passed = $passed;
        return new ChallengeResource($challenge);
    }

    public function attempt(StoreChallengeAttemptRequest $request, Challenge $challenge): JsonResponse
    {
        [$mission, $missions, $completedIds] = $this->context($request, $challenge->mission_slug);
        $this->ensureUnlocked($mission, $missions, $completedIds);
        $answer = trim((string) $request->validated('answer'));
        [$passed, $failureTitle, $description] = $this->grade($challenge, $answer);
        $missionFinished = in_array($mission->id, $completedIds, true) || $passed;

        DB::transaction(function () use ($request, $challenge, $answer, $passed, $failureTitle, $mission): void {
            ChallengeAttempt::create(['user_id' => $request->user()->id, 'challenge_id' => $challenge->id, 'answer' => $answer, 'passed' => $passed, 'failure_title' => $failureTitle]);
            if ($passed) {
                foreach (CareerTrackMission::query()->where('slug', $challenge->mission_slug)->get() as $sharedMission) {
                    $request->user()->missionCompletions()->firstOrCreate(['career_track_mission_id' => $sharedMission->id], ['completed_at' => now()]);
                }
            }
        });

        return response()->json(['data' => ['passed' => $passed, 'title' => $passed ? $challenge->success_title : $failureTitle, 'description' => $passed ? $challenge->success_description : $description, 'missionFinished' => $missionFinished]]);
    }

    private function context(Request $request, string $missionSlug): array
    {
        $goal = UserCareerGoal::query()->where('user_id', $request->user()->id)->where('is_current', true)->with('track.missions')->first();
        abort_unless($goal, 403, 'This mission is not in your current career track.');
        $missions = $goal->track->missions->sortBy('sort_order')->values();
        $mission = $missions->firstWhere('slug', $missionSlug);
        abort_unless($mission, 403, 'This mission is not in your current career track.');
        $completedIds = $request->user()->missionCompletions()->whereIn('career_track_mission_id', $missions->modelKeys())->pluck('career_track_mission_id')->all();
        return [$mission, $missions, $completedIds];
    }

    private function ensureUnlocked(CareerTrackMission $mission, $missions, array $completedIds): void
    {
        if (in_array($mission->id, $completedIds, true)) return;
        $firstUnfinished = $missions->search(fn ($candidate) => ! in_array($candidate->id, $completedIds, true));
        abort_if($firstUnfinished !== false && $missions->search(fn ($candidate) => $candidate->id === $mission->id) > $firstUnfinished, 403, 'This mission is locked.');
    }

    private function grade(Challenge $challenge, string $answer): array
    {
        if ($answer === '') return [false, 'Nothing to submit', 'Write an answer before submitting the challenge.'];
        $normalized = mb_strtolower($answer);
        foreach ($challenge->rules as $rule) {
            $needles = array_map('mb_strtolower', $rule['all_of'] ?? $rule['any_of'] ?? []);
            $matches = array_map(fn (string $needle): bool => str_contains($normalized, $needle), $needles);
            $passed = array_key_exists('all_of', $rule) ? ! in_array(false, $matches, true) : in_array(true, $matches, true);
            if (! $passed) return [false, $rule['failure_title'], $rule['failure_description']];
        }
        return [true, null, null];
    }
}
