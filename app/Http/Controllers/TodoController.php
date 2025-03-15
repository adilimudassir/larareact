<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Inertia\Inertia;
use Inertia\Response;
use App\Filters\TodoFilter;
use Illuminate\Http\Request;
use App\Traits\HasPagination;
use Illuminate\Database\Eloquent\Builder;

class TodoController extends Controller
{
    use HasPagination;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $filter = new TodoFilter($request);
        $query = Todo::query()->filter($filter);

        return Inertia::render('todos/index', [
            'todos' => $query->paginate($this->getPageSize($request))
                ->withQueryString(),
            'filters' => [
                'search' => $request->input('search'),
                'sort' => $request->input('sort', $filter->getDefaultSortField()),
                'direction' => $request->input('direction', $filter->getDefaultSortDirection())
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
     * Get the query for bulk actions
     */
    protected function getBulkActionQuery(Request $request): Builder
    {
        $query = Todo::query();

        if ($request->all) {
            $filter = new TodoFilter($request);
            return $query->filter($filter);
        }

        return $query->whereIn('id', $request->ids);
    }

    /**
     * Validate bulk action request
     */
    protected function validateBulkActionRequest(Request $request, array $additional = []): array
    {
        return $request->validate(array_merge([
            'ids' => ['array'],
            'ids.*' => ['integer', 'exists:todos,id'],
            'all' => ['required', 'boolean'],
            'filters' => ['array'],
            'filters.search' => ['nullable', 'string'],
            'filters.sort' => ['nullable', 'string'],
            'filters.direction' => ['nullable', 'string'],
        ], $additional));
    }

    /**
     * Bulk delete the specified resources from storage.
     */
    public function bulkDestroy(Request $request)
    {
        $this->validateBulkActionRequest($request);

        $query = $this->getBulkActionQuery($request);
        $count = $query->count();
        $query->delete();
        return redirect()->route('todos.index')
            ->with('success', $count . ' items deleted successfully');
    }

    /**
     * Bulk update the specified resources.
     */
    public function bulkUpdate(Request $request)
    {
        $this->validateBulkActionRequest($request, [
            'completed' => ['required', 'boolean'],
        ]);

        $query = $this->getBulkActionQuery($request);
        $count = $query->count();
        $query->update(['completed' => $request->completed]);

        $status = $request->completed ? 'completed' : 'uncompleted';
        return redirect()->route('todos.index')
            ->with('success', $count . ' items marked as ' . $status);
    }
} 