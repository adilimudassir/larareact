<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Traits\HasPagination;
use Illuminate\Support\Facades\Log;

class TodoController extends Controller
{
    use HasPagination;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Todo::query();

        // Handle search
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($query) use ($search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Handle sorting
        $sortField = $request->input('sort', 'created_at');
        $direction = $request->input('direction', 'desc');
        
        // Validate sort field to prevent SQL injection
        $allowedSortFields = ['title', 'description', 'completed', 'created_at'];
        $sortField = in_array($sortField, $allowedSortFields) ? $sortField : 'created_at';
        $direction = in_array($direction, ['asc', 'desc']) ? $direction : 'desc';

        $query->orderBy($sortField, $direction);

        return Inertia::render('todos/index', [
            'todos' => $query->paginate($this->getPageSize($request))
                ->withQueryString(), // Important: Preserve query string in pagination links
            'filters' => [
                'search' => $request->input('search'),
                'sort' => $sortField,
                'direction' => $direction
            ]
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
            'todo' => $todo
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Todo $todo): Response
    {
        return Inertia::render('todos/edit', [
            'todo' => $todo
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

    /**
     * Bulk delete the specified resources from storage.
     */
    public function bulkDestroy(Request $request)   
    {
        Log::info($request->all());

        Todo::whereIn('id', $request->ids)->delete();

        return redirect()->route('todos.index')
            ->with('success', 'Todos deleted successfully.');
    }
} 