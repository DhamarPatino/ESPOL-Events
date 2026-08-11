<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;
use App\Http\Controllers\RegistrationController;

Route::post('/events', [EventController::class, 'store']);
Route::get('/events', [EventController::class, 'index']);

// Detalle, actualizacion y eliminacion de eventos -- Cristina Pihuave
Route::get('/events/{event}', [EventController::class, 'show']);
Route::put('/events/{event}', [EventController::class, 'update']);
Route::patch('/events/{event}', [EventController::class, 'update']);
Route::delete('/events/{event}', [EventController::class, 'destroy']);

// Registro y cancelacion de participacion -- Cristina Pihuave
Route::get('/events/{event}/registrations', [RegistrationController::class, 'index']);
Route::post('/events/{event}/registrations', [RegistrationController::class, 'store']);
Route::delete('/events/{event}/registrations/{registration}', [RegistrationController::class, 'destroy']);
