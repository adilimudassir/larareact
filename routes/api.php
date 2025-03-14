<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TodoController;

// ... existing code ...

Route::apiResource('todos', TodoController::class); 