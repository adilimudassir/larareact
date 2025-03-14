<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TodoController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


    Route::resource('todos', TodoController::class);
    Route::delete('todos/bulk-destroy', [TodoController::class, 'bulkDestroy'])->name('todos.bulk-destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
