<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\ReliefCenterController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;

/*
|---------------------------------------------------------------------------
| Auth Routes
|---------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware(AuthMiddleware::class);
Route::get('/me', [AuthController::class, 'me'])->middleware(['jwt.auth']);
Route::get('/token/refresh', [AuthController::class, 'refreshToken']);

/*
|---------------------------------------------------------------------------
| Relief Center Routes
|---------------------------------------------------------------------------
*/
Route::prefix('relief-centers')->middleware(AuthMiddleware::class)->group(function () {
    Route::post('/', [ReliefCenterController::class, 'store']);
    Route::put('/{id}', [ReliefCenterController::class, 'update']);
    Route::delete('/{id}', [ReliefCenterController::class, 'destroy']);
    Route::get('/', [ReliefCenterController::class, 'index']);
    Route::get('/{id}', [ReliefCenterController::class, 'show']);
});

/*
|---------------------------------------------------------------------------
| Resource Routes
|---------------------------------------------------------------------------
*/
Route::prefix('resources')->middleware(AuthMiddleware::class)->group(function () {
    Route::post('/', [ResourceController::class, 'store']);
    Route::put('/{id}', [ResourceController::class, 'update']);
    Route::delete('/{id}', [ResourceController::class, 'destroy']);
    Route::get('/', [ResourceController::class, 'index']);
    Route::get('/{id}', [ResourceController::class, 'show']);
    Route::post('/donation/{donation}', [ResourceController::class, 'handleDonation']);
    Route::post('/aid-prep/{aidPreparation}', [ResourceController::class, 'handleAidPreparation']);
});

/*
|---------------------------------------------------------------------------
| Donation Routes
|---------------------------------------------------------------------------
*/
Route::prefix('donations')->middleware(AuthMiddleware::class)->group(function () {
    Route::post('/', [DonationController::class, 'create']);
    Route::get('/history', [DonationController::class, 'userDonations']);
    Route::get('/all', [DonationController::class, 'allDonations']);
});

/*
|---------------------------------------------------------------------------
| User Routes
|---------------------------------------------------------------------------
*/
Route::prefix('users')->middleware(AuthMiddleware::class)->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::get('/currentUser', [UserController::class, 'show']);
    Route::get('/volunteers', [UserController::class, 'showAllVolunteers']);
    Route::post('/', [UserController::class, 'store']);
    Route::put('/{id}', [UserController::class, 'update']);
    Route::delete('/{id}', [UserController::class, 'destroy']);
});
