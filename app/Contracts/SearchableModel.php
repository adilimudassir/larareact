<?php

namespace App\Contracts;

interface SearchableModel
{
    /**
     * Get the fields that can be searched
     */
    public function getSearchableFields(): array;
} 