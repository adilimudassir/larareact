<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;

trait HasFilters
{
    /**
     * Apply filters to the query builder
     */
    protected function applyFilters(Builder $query, Request $request): Builder
    {
        // Apply search filter if provided
        if ($request->has('search')) {
            $search = $request->input('search');
            $searchableFields = $this->getSearchableFields();
            
            $query->where(function (Builder $query) use ($search, $searchableFields) {
                foreach ($searchableFields as $field) {
                    $query->orWhere($field, 'like', "%{$search}%");
                }
            });
        }

        // Apply sorting if provided
        $sortField = $request->input('sort', $this->getDefaultSortField());
        $direction = $request->input('direction', $this->getDefaultSortDirection());
        
        // Validate sort field to prevent SQL injection
        $allowedSortFields = $this->getAllowedSortFields();
        $sortField = in_array($sortField, $allowedSortFields) ? $sortField : $this->getDefaultSortField();
        $direction = in_array($direction, ['asc', 'desc']) ? $direction : $this->getDefaultSortDirection();

        $query->orderBy($sortField, $direction);

        return $query;
    }

    /**
     * Get the fields that can be searched
     */
    protected function getSearchableFields(): array
    {
        return ['title', 'description'];
    }

    /**
     * Get the fields that can be sorted
     */
    protected function getAllowedSortFields(): array
    {
        return ['title', 'description', 'completed', 'created_at'];
    }

    /**
     * Get the default sort field
     */
    protected function getDefaultSortField(): string
    {
        return 'created_at';
    }

    /**
     * Get the default sort direction
     */
    protected function getDefaultSortDirection(): string
    {
        return 'desc';
    }
} 