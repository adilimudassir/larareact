<?php

namespace App\Models;

use App\Traits\Filterable;
use App\Contracts\SearchableModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Todo extends Model implements SearchableModel
{
    use HasFactory, SoftDeletes, Filterable;

    protected $fillable = [
        'title',
        'description',
        'completed'
    ];

    protected $casts = [
        'completed' => 'boolean'
    ];

    /**
     * Get the fields that can be searched
     */
    public function getSearchableFields(): array
    {
        return ['title', 'description'];
    }
} 