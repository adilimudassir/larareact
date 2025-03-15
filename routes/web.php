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

    // Define bulk actions before resource routes
    Route::delete('todos/bulk/destroy', [TodoController::class, 'bulkDestroy'])->name('todos.bulk.destroy');
    Route::put('todos/bulk/update', [TodoController::class, 'bulkUpdate'])->name('todos.bulk.update');
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
