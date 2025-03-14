<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Traits\HasPagination;
use App\Http\Resources\TodoResource;

class TodoController extends Controller
{
    use HasPagination;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('todos/index', [
            'todos' => Todo::latest()->paginate($this->getPageSize($request))
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('todos/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'completed' => 'boolean'
        ]);

        Todo::create($validated);

        return redirect()->route('todos.index')
            ->with('success', 'Todo created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Todo $todo): Response
    {
        return Inertia::render('todos/show', [
            'todo' => TodoResource::make($todo)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Todo $todo): Response
    {
        return Inertia::render('todos/edit', [
            'todo' => TodoResource::make($todo)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Todo $todo)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'completed' => 'sometimes|boolean'
        ]);

        $todo->update($validated);

        return redirect()->route('todos.index')
            ->with('success', 'Todo updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Todo $todo)
    {
        $todo->delete();

        return redirect()->route('todos.index')
            ->with('success', 'Todo deleted successfully.');
    }
} 