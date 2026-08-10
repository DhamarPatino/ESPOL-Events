<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;

Route::post('/events', [EventController::class, 'store']);
Route::get('/events', [EventController::class, 'index']);
