<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Traits\HasPagination;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;

abstract class ResourceController extends Controller
{
    use HasPagination;

    /**
     * Get the repository instance
     */
    abstract protected function getRepository();

    /**
     * Get the resource class
     */
    abstract protected function getResourceClass(): string;

    /**
     * Get the validation rules for store
     */
    abstract protected function getStoreValidationRules(): array;

    /**
     * Get the validation rules for update
     */
    abstract protected function getUpdateValidationRules(): array;

    /**
     * Get the Inertia view path for index
     */
    abstract protected function getIndexView(): string;

    /**
     * Get the Inertia view path for create
     */
    abstract protected function getCreateView(): string;

    /**
     * Get the Inertia view path for edit
     */
    abstract protected function getEditView(): string;

    /**
     * Get the Inertia view path for show
     */
    abstract protected function getShowView(): string;

    /**
     * Get the route name for redirect after action
     */
    abstract protected function getIndexRouteName(): string;

    /**
     * Transform the resource collection
     */
    protected function transformCollection($paginator)
    {
        $resourceClass = $this->getResourceClass();
        return $paginator->through(fn ($item) => new $resourceClass($item));
    }

    public function index(Request $request): Response
    {
        $query = $this->getRepository()->query();
        $paginator = $this->paginateQuery($query, $request);
        
        return Inertia::render($this->getIndexView(), [
            'items' => $this->transformCollection($paginator)
        ]);
    }

    public function create(): Response
    {
        return Inertia::render($this->getCreateView());
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->getStoreValidationRules());
        
        $this->getRepository()->create($validated);

        return redirect()->route($this->getIndexRouteName())
            ->with('success', 'Item created successfully.');
    }

    public function show(Model $model): Response
    {
        $resourceClass = $this->getResourceClass();
        
        return Inertia::render($this->getShowView(), [
            'item' => new $resourceClass($model)
        ]);
    }

    public function edit(Model $model): Response
    {
        $resourceClass = $this->getResourceClass();
        
        return Inertia::render($this->getEditView(), [
            'item' => new $resourceClass($model)
        ]);
    }

    public function update(Request $request, Model $model)
    {
        $validated = $request->validate($this->getUpdateValidationRules());
        
        $this->getRepository()->update($model, $validated);

        return redirect()->route($this->getIndexRouteName())
            ->with('success', 'Item updated successfully.');
    }

    public function destroy(Model $model)
    {
        $this->getRepository()->delete($model);

        return redirect()->route($this->getIndexRouteName())
            ->with('success', 'Item deleted successfully.');
    }
} 