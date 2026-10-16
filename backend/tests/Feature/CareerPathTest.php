<?php

namespace Tests\Feature;

use App\Models\CareerTrack;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\CourseLesson;
use App\Models\LessonProgress;
use App\Models\User;
use App\Models\UserCareerGoal;
use App\Models\UserMissionCompletion;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CareerPathTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\CourseCatalogSeeder::class);
        $this->seed(\Database\Seeders\CareerTrackSeeder::class);
    }

    public function test_career_endpoints_require_authentication(): void
    {
        $this->getJson('/api/career-tracks')->assertUnauthorized();
        $this->getJson('/api/me/career-goal')->assertUnauthorized();
        $this->putJson('/api/me/career-goal', ['track_slug' => 'full-stack'])->assertUnauthorized();
        $this->getJson('/api/me/career-path')->assertUnauthorized();
    }

    public function test_goal_and_path_are_scoped_and_missing_goal_is_explicit(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $this->actingAs($owner)->putJson('/api/me/career-goal', ['track_slug' => 'full-stack'])->assertSuccessful();

        $this->actingAs($other)->getJson('/api/me/career-goal')->assertOk()->assertJsonPath('data', null);
        $this->actingAs($other)->getJson('/api/me/career-path')->assertStatus(409);
        $this->actingAs($owner)->getJson('/api/me/career-goal')->assertJsonPath('data.track.slug', 'full-stack');
    }

    public function test_changing_goal_preserves_history_enrollment_and_progress(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->putJson('/api/me/career-goal', ['track_slug' => 'full-stack'])->assertSuccessful();
        $this->actingAs($user)->putJson('/api/me/career-goal', ['track_slug' => 'full-stack'])->assertSuccessful();
        $this->assertDatabaseCount('user_career_goals', 1);
        $course = Course::where('slug', 'python-foundations')->first();
        $lesson = $course->lessons()->first();
        $enrollment = CourseEnrollment::factory()->create(['user_id' => $user->id, 'course_id' => $course->id]);
        LessonProgress::factory()->create(['course_enrollment_id' => $enrollment->id, 'course_lesson_id' => $lesson->id, 'position_seconds' => 42]);

        $this->actingAs($user)->putJson('/api/me/career-goal', ['track_slug' => 'back-end'])->assertSuccessful();
        $this->assertDatabaseCount('user_career_goals', 2);
        $this->assertDatabaseHas('user_career_goals', ['user_id' => $user->id, 'is_current' => 0]);
        $this->assertDatabaseHas('user_career_goals', ['user_id' => $user->id, 'career_track_id' => CareerTrack::where('slug', 'back-end')->value('id'), 'is_current' => 1]);
        $this->assertDatabaseCount('course_enrollments', 1);
        $this->assertDatabaseCount('lesson_progress', 1);
    }

    public function test_invalid_and_inactive_goals_are_rejected(): void
    {
        $user = User::factory()->create();
        CareerTrack::factory()->create(['slug' => 'inactive-track', 'active' => false]);
        $this->actingAs($user)->putJson('/api/me/career-goal', ['track_slug' => 'missing'])->assertUnprocessable();
        $this->actingAs($user)->putJson('/api/me/career-goal', ['track_slug' => 'inactive-track'])->assertUnprocessable();
    }

    public function test_path_derives_status_fuel_and_boss_from_completions(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->putJson('/api/me/career-goal', ['track_slug' => 'full-stack'])->assertSuccessful();
        $track = CareerTrack::where('slug', 'full-stack')->first();
        $missions = $track->missions;

        $zero = $this->actingAs($user)->getJson('/api/me/career-path')->assertOk();
        $zero->assertJsonPath('data.fuelPercent', 0)->assertJsonPath('data.missions.0.status', 'extracting')->assertJsonPath('data.missions.1.status', 'locked')->assertJsonPath('data.boss.locked', true);

        UserMissionCompletion::factory()->create(['user_id' => $user->id, 'career_track_mission_id' => $missions[0]->id]);
        $one = $this->actingAs($user)->getJson('/api/me/career-path')->assertOk();
        $one->assertJsonPath('data.fuelPercent', 33)->assertJsonPath('data.missions.0.status', 'finished')->assertJsonPath('data.missions.1.status', 'extracting')->assertJsonPath('data.missions.2.status', 'locked');

        UserMissionCompletion::factory()->create(['user_id' => $user->id, 'career_track_mission_id' => $missions[1]->id]);
        UserMissionCompletion::factory()->create(['user_id' => $user->id, 'career_track_mission_id' => $missions[2]->id]);
        $all = $this->actingAs($user)->getJson('/api/me/career-path')->assertOk();
        $all->assertJsonPath('data.fuelPercent', 100)->assertJsonPath('data.missions.0.status', 'finished')->assertJsonPath('data.missions.1.status', 'finished')->assertJsonPath('data.missions.2.status', 'finished')->assertJsonPath('data.boss.locked', false);
    }

    public function test_career_responses_do_not_expose_numeric_ids(): void
    {
        $user = User::factory()->create();
        $tracks = $this->actingAs($user)->getJson('/api/career-tracks')->assertOk();
        $tracks->assertJsonMissingPath('data.0.id');
        $goal = $this->actingAs($user)->putJson('/api/me/career-goal', ['track_slug' => 'full-stack'])->assertSuccessful();
        $path = $this->actingAs($user)->getJson('/api/me/career-path')->assertOk();
        $this->assertStringNotContainsString('"id"', $goal->getContent());
        $this->assertStringNotContainsString('"id"', $path->getContent());
    }
}
