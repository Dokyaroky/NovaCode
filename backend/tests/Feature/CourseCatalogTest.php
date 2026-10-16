<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\CourseCatalogSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseCatalogTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CourseCatalogSeeder::class);
    }

    public function test_unauthenticated_users_cannot_read_the_catalog(): void
    {
        $this->getJson('/api/courses')->assertUnauthorized();
    }

    public function test_authenticated_users_can_read_the_catalog_without_numeric_ids(): void
    {
        $response = $this->actingAs(User::factory()->create())->getJson('/api/courses');

        $response
            ->assertOk()
            ->assertJsonCount(6, 'data')
            ->assertJsonPath('data.0.slug', 'ai-with-python')
            ->assertJsonPath('data.0.lessons', 16)
            ->assertJsonPath('meta.total', 6);

        $this->assertStringNotContainsString('"id"', $response->getContent());
    }

    public function test_search_and_category_filters_work(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson('/api/courses?search=react')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'react-from-scratch');

        $this->actingAs($user)
            ->getJson('/api/courses?category=python')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.categories.0.slug', 'python');
    }

    public function test_categories_and_slug_lookup_are_available_to_authenticated_users(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson('/api/course-categories')
            ->assertOk()
            ->assertJsonCount(4, 'data')
            ->assertJsonMissingPath('data.0.id');

        $this->actingAs($user)
            ->getJson('/api/courses/python-foundations')
            ->assertOk()
            ->assertJsonPath('data.slug', 'python-foundations')
            ->assertJsonPath('data.lessons', 24)
            ->assertJsonMissingPath('data.id');
    }
}
