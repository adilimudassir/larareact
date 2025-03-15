<?php

namespace App\Filters;

use App\Contracts\SearchableModel;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

abstract class Filter
{
    protected Request $request;
    protected Builder $builder;
    protected array $filters = ['search'];
    protected array $allowedSortFields = [];

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Apply filters to the query builder
     */
    public function apply(Builder $builder): Builder
    {
        $this->builder = $builder;

        foreach ($this->getFilters() as $filter => $value) {
            if (method_exists($this, $filter) && $value !== null && $value !== '') {
                $this->$filter($value);
            }
        }

        $this->sort();

        return $this->builder;
    }

    /**
     * Get all request filters
     */
    protected function getFilters(): array
    {
        return array_filter($this->request->only($this->filters));
    }

    /**
     * Apply sorting to the query
     */
    protected function sort(): void
    {
        $sortField = $this->request->input('sort', $this->getDefaultSortField());
        $direction = $this->request->input('direction', $this->getDefaultSortDirection());
        
        $sortField = in_array($sortField, $this->allowedSortFields) ? $sortField : $this->getDefaultSortField();
        $direction = in_array($direction, ['asc', 'desc']) ? $direction : $this->getDefaultSortDirection();

        $this->builder->orderBy($sortField, $direction);
    }

    /**
     * Default search implementation for searchable models
     */
    protected function search(string $term): void
    {
        $model = $this->builder->getModel();
        
        if (!$model instanceof SearchableModel) {
            return;
        }

        $searchableFields = $model->getSearchableFields();
        
        if (empty($searchableFields)) {
            return;
        }

        $this->builder->where(function (Builder $query) use ($term, $searchableFields) {
            foreach ($searchableFields as $field) {
                $query->orWhere($field, 'like', "%{$term}%");
            }
        });
    }

    /**
     * Get the default sort field
     */
    public function getDefaultSortField(): string
    {
        return 'created_at';
    }

    /**
     * Get the default sort direction
     */
    public function getDefaultSortDirection(): string
    {
        return 'desc';
    }
} 