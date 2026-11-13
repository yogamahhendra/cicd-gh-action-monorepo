<?php

use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('can list all tasks', function () {
    Task::create(['title' => 'Sample Task 1', 'is_completed' => false]);
    Task::create(['title' => 'Sample Task 2', 'is_completed' => true]);

    $response = $this->getJson('/api/tasks');

    $response->assertStatus(200)
        ->assertJsonCount(2, 'data')
        ->assertJsonStructure(['data', 'changes' => ['message']]);

    expect($response->json('changes.message'))->toContain('testing perubahan di');
});

test('can create a new task', function () {
    $payload = ['title' => 'Learn GitHub Actions'];

    $response = $this->postJson('/api/tasks', $payload);

    $response->assertStatus(201)
        ->assertJsonFragment(['title' => 'Learn GitHub Actions', 'is_completed' => false]);

    $this->assertDatabaseHas('tasks', ['title' => 'Learn GitHub Actions']);
});

test('validates title when creating task', function () {
    $response = $this->postJson('/api/tasks', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['title']);
});

test('can update task status', function () {
    $task = Task::create(['title' => 'Incomplete task', 'is_completed' => false]);

    $response = $this->putJson("/api/tasks/{$task->id}", [
        'is_completed' => true,
    ]);

    $response->assertStatus(200)
        ->assertJsonFragment(['is_completed' => true]);

    $this->assertDatabaseHas('tasks', [
        'id' => $task->id,
        'is_completed' => true,
    ]);
});

test('can delete a task', function () {
    $task = Task::create(['title' => 'Task to delete', 'is_completed' => false]);

    $response = $this->deleteJson("/api/tasks/{$task->id}");

    $response->assertStatus(200);
    $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
});

test('returns 404 when deleting non-existent task', function () {
    $response = $this->deleteJson('/api/tasks/99999');

    $response->assertStatus(404);
});

test('returns 404 when updating non-existent task', function () {
    $response = $this->putJson('/api/tasks/99999', [
        'title' => 'Updated non-existent',
    ]);

    $response->assertStatus(404);
});
