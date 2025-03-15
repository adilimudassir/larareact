<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TodoController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Define bulk actions before resource routes
    Route::delete('todos/bulk/destroy', [TodoController::class, 'bulkDestroy'])->name('todos.bulk.destroy');
    Route::put('todos/bulk/update', [TodoController::class, 'bulkUpdate'])->name('todos.bulk.update');
    Route::resource('todos', TodoController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
