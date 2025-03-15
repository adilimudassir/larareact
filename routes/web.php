<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TodoController;
use App\Http\Controllers\UserController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Todos management
    Route::prefix('todos')->middleware('can:view-todos')->group(function () {
        Route::delete('bulk/destroy', [TodoController::class, 'bulkDestroy'])
            ->name('todos.bulk.destroy')
            ->middleware('can:delete-todos');
            
        Route::put('bulk/update', [TodoController::class, 'bulkUpdate'])
            ->name('todos.bulk.update')
            ->middleware('can:update-todos');
    });
    
    Route::resource('todos', TodoController::class);

    // Users management
    Route::resource('users', UserController::class)
        ->middleware('can:view-users');

    // Roles management
    Route::resource('roles', RoleController::class)
        ->middleware('can:view-roles');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
