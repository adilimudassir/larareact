<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

trait HasPagination
{
    /**
     * Get allowed page sizes
     */
    protected function getAllowedPageSizes(): array
    {
        return config('pagination.allowed_page_sizes', [10, 20, 50, 100, 500]);
    }

    /**
     * Get default page size
     */
    protected function getDefaultPageSize(): int
    {
        return config('pagination.default_page_size', 10);
    }

    /**
     * Get validated page size from request
     */
    protected function getPageSize(Request $request): int
    {
        $perPage = (int) $request->input('per_page', $this->getDefaultPageSize());
        return in_array($perPage, $this->getAllowedPageSizes()) ? $perPage : $this->getDefaultPageSize();
    }

    /**
     * Paginate query with proper page size
     */
    protected function paginateQuery($query, Request $request): LengthAwarePaginator
    {
        return $query->paginate($this->getPageSize($request));
    }
} 