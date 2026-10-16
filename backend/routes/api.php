<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Resources\UserResource;

Route::get('/health', fn () => response()->json([
    'status' => 'ok',
    'app' => config('app.name'),
    'time' => now()->toIso8601String(),
]));

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/user', fn (Request $request) => UserResource::make($request->user()))
    ->middleware('auth:sanctum');

Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth:sanctum');
