<?php

namespace Tests\Feature;

use App\Models\CareerTrack;
use App\Models\CareerTrackMission;
use App\Models\Challenge;
use App\Models\User;
use App\Models\UserMissionCompletion;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChallengeTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\CareerTrackSeeder::class);
        $this->seed(\Database\Seeders\ChallengeSeeder::class);
    }

    public function test_challenge_endpoints_require_authentication(): void
    {
        $this->getJson('/api/me/missions/htmlcss-base/challenge')->assertUnauthorized();
        $this->postJson('/api/challenges/htmlcss-base/attempts', ['answer' => '<h1>Hello World</h1>'])->assertUnauthorized();
    }

    public function test_starters_and_comment_only_answers_fail_while_real_answers_pass(): void
    {
        $fullStackUser = $this->userWithGoal('full-stack');
        $html = Challenge::query()->where('slug', 'htmlcss-base')->firstOrFail();
        $this->actingAs($fullStackUser)->postJson('/api/challenges/htmlcss-base/attempts', ['answer' => $html->starter_code])
            ->assertOk()->assertJsonPath('data.passed', false)->assertJsonPath('data.title', 'Nothing to submit');
        $this->actingAs($fullStackUser)->postJson('/api/challenges/htmlcss-base/attempts', ['answer' => '<!-- <h1>Hello World</h1> -->'])
            ->assertOk()->assertJsonPath('data.passed', false)->assertJsonPath('data.title', 'Nothing to submit');
        $this->actingAs($fullStackUser)->postJson('/api/challenges/htmlcss-base/attempts', ['answer' => '<h1>Hello World</h1>'])
            ->assertOk()->assertJsonPath('data.passed', true);

        $frontEndUser = $this->userWithGoal('front-end');
        $this->actingAs($frontEndUser)->postJson('/api/challenges/htmlcss-base/attempts', ['answer' => '<h1>Hello World</h1>'])->assertOk();
        $frontEndTrack = CareerTrack::query()->where('slug', 'front-end')->firstOrFail();
        $javascriptMission = CareerTrackMission::query()->where('career_track_id', $frontEndTrack->id)->where('slug', 'javascript-essentials')->firstOrFail();
        UserMissionCompletion::create(['user_id' => $frontEndUser->id, 'career_track_mission_id' => $javascriptMission->id, 'completed_at' => now()]);
        $react = Challenge::query()->where('slug', 'react-ui')->firstOrFail();
        $this->actingAs($frontEndUser)->postJson('/api/challenges/react-ui/attempts', ['answer' => $react->starter_code])
            ->assertOk()->assertJsonPath('data.passed', false)->assertJsonPath('data.title', 'Nothing to submit');
        $this->actingAs($frontEndUser)->postJson('/api/challenges/react-ui/attempts', ['answer' => '// useState count'])
            ->assertOk()->assertJsonPath('data.passed', false)->assertJsonPath('data.title', 'Nothing to submit');
        $this->actingAs($frontEndUser)->postJson('/api/challenges/react-ui/attempts', ['answer' => 'const [count, setCount] = useState(0)'])
            ->assertOk()->assertJsonPath('data.passed', true);

        $backEndUser = $this->userWithGoal('back-end');
        $node = Challenge::query()->where('slug', 'nodejs-backend')->firstOrFail();
        $this->actingAs($backEndUser)->postJson('/api/challenges/nodejs-backend/attempts', ['answer' => $node->starter_code])
            ->assertOk()->assertJsonPath('data.passed', false)->assertJsonPath('data.title', 'Nothing to submit');
        $this->actingAs($backEndUser)->postJson('/api/challenges/nodejs-backend/attempts', ['answer' => "// app.get('/', (req, res) => res.send('Hello API'))"])
            ->assertOk()->assertJsonPath('data.passed', false)->assertJsonPath('data.title', 'Nothing to submit');
        $this->actingAs($backEndUser)->postJson('/api/challenges/nodejs-backend/attempts', ['answer' => "app.get('/', (req, res) => { res.send('Hello API') })"])
            ->assertOk()->assertJsonPath('data.passed', true);
    }

    public function test_seeded_challenges_match_mission_slugs_and_are_reported_on_the_full_stack_path(): void
    {
        $missionSlugs = CareerTrackMission::query()->pluck('slug')->all();
        $this->assertEmpty(Challenge::query()->whereNotIn('mission_slug', $missionSlugs)->get());

        $user = $this->userWithGoal('full-stack');
        $path = $this->actingAs($user)->getJson('/api/me/career-path')->assertOk();
        $path->assertJsonPath('data.missions.0.hasChallenge', true)
            ->assertJsonPath('data.missions.1.hasChallenge', true)
            ->assertJsonPath('data.missions.2.hasChallenge', true);
    }

    public function test_challenge_can_have_a_different_public_slug_from_its_mission_slug(): void
    {
        $challenge = Challenge::query()->where('slug', 'htmlcss-base')->firstOrFail();
        $challenge->update(['slug' => 'htmlcss-base-check']);
        $user = $this->userWithGoal('full-stack');

        $this->actingAs($user)->getJson('/api/me/missions/htmlcss-base/challenge')->assertOk();
        $this->actingAs($user)->postJson('/api/challenges/htmlcss-base-check/attempts', ['answer' => '<h1>Hello World</h1>'])
            ->assertOk()->assertJsonPath('data.passed', true);
    }

    public function test_wrong_answer_fails_with_server_verdict_and_stores_attempt(): void
    {
        $user = $this->userWithGoal('full-stack');
        $response = $this->actingAs($user)->postJson('/api/challenges/htmlcss-base/attempts', ['answer' => '<p>Hello World</p>'])->assertOk();
        $response->assertJsonPath('data.passed', false)->assertJsonPath('data.title', 'Missing <h1> element')->assertJsonPath('data.missionFinished', false);
        $this->assertDatabaseHas('challenge_attempts', ['user_id' => $user->id, 'passed' => 0, 'failure_title' => 'Missing <h1> element']);
    }

    public function test_correct_answer_finishes_the_mission_and_repeating_it_is_idempotent(): void
    {
        $user = $this->userWithGoal('full-stack');
        $first = $this->actingAs($user)->postJson('/api/challenges/htmlcss-base/attempts', ['answer' => '<h1>Hello World</h1>'])->assertOk();
        $first->assertJsonPath('data.passed', true)->assertJsonPath('data.missionFinished', true);
        $this->actingAs($user)->postJson('/api/challenges/htmlcss-base/attempts', ['answer' => '<h1>Hello World</h1>'])->assertOk();
        $this->assertDatabaseCount('user_mission_completions', 2);
        $path = $this->actingAs($user)->getJson('/api/me/career-path')->assertOk();
        $path->assertJsonPath('data.fuelPercent', 33)->assertJsonPath('data.missions.0.status', 'finished')->assertJsonPath('data.missions.1.status', 'extracting');
    }

    public function test_shared_mission_pass_counts_for_every_track_but_not_for_other_users(): void
    {
        $userA = $this->userWithGoal('full-stack');
        $userB = $this->userWithGoal('front-end');
        $this->actingAs($userA)->postJson('/api/challenges/htmlcss-base/attempts', ['answer' => '<h1>Hello World</h1>'])->assertOk();
        $userBPath = $this->actingAs($userB)->getJson('/api/me/career-path')->assertOk();
        $userBPath->assertJsonPath('data.fuelPercent', 0);

        $userAPath = $this->actingAs($userA)->getJson('/api/me/career-path')->assertOk();
        $userAPath->assertJsonPath('data.fuelPercent', 33)->assertJsonPath('data.missions.0.status', 'finished');

        $userBSecond = User::factory()->create();
        $this->actingAs($userBSecond)->putJson('/api/me/career-goal', ['track_slug' => 'front-end'])->assertSuccessful();
        $this->actingAs($userBSecond)->postJson('/api/challenges/htmlcss-base/attempts', ['answer' => '<h1>Hello World</h1>'])->assertOk();
        $this->assertDatabaseCount('user_mission_completions', 4);
    }

    public function test_locked_and_out_of_track_missions_are_forbidden(): void
    {
        $user = $this->userWithGoal('full-stack');
        $this->actingAs($user)->getJson('/api/me/missions/react-ui/challenge')->assertForbidden();
        $this->actingAs($user)->postJson('/api/challenges/react-ui/attempts', ['answer' => 'const [count] = useState(0)'])->assertForbidden();

        $otherTrackUser = $this->userWithGoal('back-end');
        $this->actingAs($otherTrackUser)->getJson('/api/me/missions/htmlcss-base/challenge')->assertForbidden();
        $this->actingAs($otherTrackUser)->postJson('/api/challenges/htmlcss-base/attempts', ['answer' => '<h1>Hello World</h1>'])->assertForbidden();
    }

    public function test_mission_without_challenge_returns_not_found_and_answer_length_is_validated(): void
    {
        $track = CareerTrack::factory()->create(['slug' => 'empty-challenge-track']);
        CareerTrackMission::factory()->create(['career_track_id' => $track->id, 'slug' => 'no-challenge-mission', 'sort_order' => 1]);
        $user = User::factory()->create();
        $this->actingAs($user)->putJson('/api/me/career-goal', ['track_slug' => 'empty-challenge-track'])->assertSuccessful();
        $this->actingAs($user)->getJson('/api/me/missions/no-challenge-mission/challenge')->assertNotFound();

        $user = $this->userWithGoal('full-stack');
        $this->actingAs($user)->postJson('/api/challenges/htmlcss-base/attempts', ['answer' => str_repeat('x', 5001)])->assertUnprocessable();
    }

    public function test_challenge_responses_exclude_rules_and_numeric_ids(): void
    {
        $user = $this->userWithGoal('full-stack');
        $challenge = $this->actingAs($user)->getJson('/api/me/missions/htmlcss-base/challenge')->assertOk();
        $attempt = $this->actingAs($user)->postJson('/api/challenges/htmlcss-base/attempts', ['answer' => ''])->assertOk();
        $this->assertStringNotContainsString('rules', $challenge->getContent());
        $this->assertStringNotContainsString('"id"', $challenge->getContent());
        $this->assertStringNotContainsString('"id"', $attempt->getContent());
    }

    private function userWithGoal(string $trackSlug): User
    {
        $user = User::factory()->create();
        $this->actingAs($user)->putJson('/api/me/career-goal', ['track_slug' => $trackSlug])->assertSuccessful();
        return $user;
    }
}
