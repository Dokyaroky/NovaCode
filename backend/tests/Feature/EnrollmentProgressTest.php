<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\CourseLesson;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EnrollmentProgressTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\CourseCatalogSeeder::class);
    }

    public function test_enrollments_require_authentication(): void
    {
        $this->getJson('/api/me/enrollments')->assertUnauthorized();
        $this->postJson('/api/courses/python-foundations/enroll')->assertUnauthorized();
    }

    public function test_enrollment_is_idempotent_and_returns_no_numeric_ids(): void
    {
        $user = User::factory()->create();
        $first = $this->actingAs($user)->postJson('/api/courses/python-foundations/enroll')->assertSuccessful();
        $second = $this->actingAs($user)->postJson('/api/courses/python-foundations/enroll')->assertSuccessful();

        $this->assertDatabaseCount('course_enrollments', 1);
        $this->assertSame($first->json('data.uuid'), $second->json('data.uuid'));
        $this->assertStringNotContainsString('"id"', $first->getContent());
    }

    public function test_user_cannot_read_or_modify_another_users_enrollment_or_progress(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $this->actingAs($owner)->postJson('/api/courses/python-foundations/enroll')->assertSuccessful();
        $lesson = Course::where('slug', 'python-foundations')->first()->lessons()->first();

        $this->actingAs($other)->getJson('/api/me/enrollments')->assertOk()->assertJsonPath('data', []);
        $this->actingAs($other)->getJson('/api/me/courses/python-foundations')->assertNotFound();
        $this->actingAs($other)->postJson("/api/me/lessons/{$lesson->uuid}/progress", ['position_seconds' => 10])->assertNotFound();
        $this->actingAs($other)->postJson("/api/me/lessons/{$lesson->uuid}/complete")->assertNotFound();
    }

    public function test_completing_lessons_computes_progress_on_the_server(): void
    {
        $user = User::factory()->create();
        $course = Course::factory()->create(['slug' => 'two-lesson-course']);
        $first = CourseLesson::factory()->for($course)->create(['sort_order' => 1]);
        $second = CourseLesson::factory()->for($course)->create(['sort_order' => 2]);
        $this->actingAs($user)->postJson('/api/courses/two-lesson-course/enroll')->assertSuccessful();

        $response = $this->actingAs($user)->postJson("/api/me/lessons/{$first->uuid}/complete")->assertOk();
        $response->assertJsonPath('data.progress', 50);
        $response = $this->actingAs($user)->postJson("/api/me/lessons/{$second->uuid}/complete")->assertOk();
        $response->assertJsonPath('data.progress', 100);
        $this->assertStringNotContainsString('"id"', $response->getContent());
    }

    public function test_progress_validates_input_and_saves_resume_position(): void
    {
        $user = User::factory()->create();
        $course = Course::where('slug', 'python-foundations')->first();
        $lesson = $course->lessons()->first();
        $this->actingAs($user)->postJson('/api/courses/python-foundations/enroll')->assertSuccessful();

        $this->actingAs($user)->postJson("/api/me/lessons/{$lesson->uuid}/progress", ['position_seconds' => -1])->assertUnprocessable();
        $this->actingAs($user)->postJson("/api/me/lessons/{$lesson->uuid}/progress", [])->assertUnprocessable();
        $this->actingAs($user)->postJson("/api/me/lessons/{$lesson->uuid}/progress", ['position_seconds' => 42, 'percent' => 99])->assertSuccessful()->assertJsonPath('data.positionSeconds', 42);
    }
}
