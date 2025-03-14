<?php

namespace App\Repositories;

use App\Models\Todo;
use Illuminate\Database\Eloquent\Builder;

class TodoRepository
{
    public function query(): Builder
    {
        return Todo::latest();
    }

    public function create(array $data): Todo
    {
        return Todo::create($data);
    }

    public function update(Todo $todo, array $data): bool
    {
        return $todo->update($data);
    }

    public function delete(Todo $todo): bool
    {
        return $todo->delete();
    }
} 