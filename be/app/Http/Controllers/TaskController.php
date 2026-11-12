<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Task::latest()->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $task = Task::create([
            'title' => $validated['title'],
            'is_completed' => false,
        ]);

        return response()->json($task, 201);
    }

    public function update(Request $request, Task $task): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'is_completed' => 'sometimes|boolean',
        ]);

        $task->update($validated);

        return response()->json($task);
    }

    public function destroy(Task $task): JsonResponse
    {
        $task->delete();

        return response()->json(['message' => 'Task deleted']);
    }
}
