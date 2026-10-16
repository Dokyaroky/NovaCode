<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_only_read_their_own_identity(): void
    {
        $userA = User::factory()->create(['name' => 'User A', 'email' => 'a@example.com']);
        $userB = User::factory()->create(['name' => 'User B', 'email' => 'b@example.com']);

        $response = $this->actingAs($userA)->getJson('/api/user');

        $response
            ->assertOk()
            ->assertJsonPath('data.name', 'User A')
            ->assertJsonPath('data.email', 'a@example.com')
            ->assertJsonMissing(['name' => $userB->name])
            ->assertJsonMissing(['email' => $userB->email])
            ->assertJsonMissingPath('data.id')
            ->assertJsonMissingPath('data.password')
            ->assertJsonMissingPath('data.remember_token');
    }

    public function test_registration_requires_server_side_validation(): void
    {
        $response = $this->postJson('/api/register', ['email' => 'not-an-email']);

        $response->assertUnprocessable()->assertJsonValidationErrors(['name', 'email', 'password']);
    }
}
