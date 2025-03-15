<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class TodoFilter extends Filter
{
    protected array $filters = ['search', 'completed'];

    protected array $allowedSortFields = ['title', 'created_at', 'completed'];

    public function completed($value)
    {
        return $this->builder->where('completed', $value === 'true');
    }
} 