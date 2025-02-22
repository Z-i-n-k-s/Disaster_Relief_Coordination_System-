<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\ReliefCenterController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware(AuthMiddleware::class);
Route::get('/me', [AuthController::class, 'me'])->middleware(['jwt.auth']);
Route::get('/token/refresh', [AuthController::class, 'refreshToken']);

/*
|--------------------------------------------------------------------------
| Relief Center Routes
|--------------------------------------------------------------------------
*/
Route::prefix('relief-centers')->group(function () {
    Route::post('/', [ReliefCenterController::class, 'store']);
    Route::put('/{id}', [ReliefCenterController::class, 'update']);
    Route::delete('/{id}', [ReliefCenterController::class, 'destroy']);
    Route::get('/', [ReliefCenterController::class, 'index']);
    Route::get('/{id}', [ReliefCenterController::class, 'show']);
});

/*
|--------------------------------------------------------------------------
| Resource Routes
|--------------------------------------------------------------------------
*/
Route::prefix('resources')->group(function () {
    Route::post('/', [ResourceController::class, 'store']);
    Route::put('/{id}', [ResourceController::class, 'update']);
    Route::delete('/{id}', [ResourceController::class, 'destroy']);
    Route::get('/', [ResourceController::class, 'index']);
    Route::get('/{id}', [ResourceController::class, 'show']);
    Route::post('/donation/{donation}', [ResourceController::class, 'handleDonation']);
    Route::post('/aid-prep/{aidPreparation}', [ResourceController::class, 'handleAidPreparation']);
});

/*
|--------------------------------------------------------------------------
| Donation Routes
|--------------------------------------------------------------------------
*/
Route::prefix('donations')->group(function () {
    Route::post('/', [DonationController::class, 'create']);
    // For regular users: view their donation history.
    Route::get('/history', [DonationController::class, 'userDonations'])->middleware(AuthMiddleware::class);
    // For admins: view all donation records.
    Route::get('/all', [DonationController::class, 'allDonations'])->middleware('auth:api');
});

/*
|--------------------------------------------------------------------------
| User Routes
|--------------------------------------------------------------------------
*/
Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::get('/currentUser', [UserController::class, 'show'])->middleware(AuthMiddleware::class);
    Route::get('/volunteers', [UserController::class, 'showAllVolunteers']);
    Route::post('/', [UserController::class, 'store']);
    Route::put('/{id}', [UserController::class, 'update']);
    Route::delete('/{id}', [UserController::class, 'destroy']);
});
