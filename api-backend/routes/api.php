<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\ReliefCenterController;
use App\Http\Controllers\ResourceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| auth Routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['jwt.auth'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});


/*
|--------------------------------------------------------------------------
| relief-center Routes
|--------------------------------------------------------------------------
*/

Route::post('/relief-centers', [ReliefCenterController::class, 'store']);
Route::put('/relief-centers/{id}', [ReliefCenterController::class, 'update']);
Route::delete('/relief-centers/{id}', [ReliefCenterController::class, 'destroy']);
Route::get('/relief-centers', [ReliefCenterController::class, 'index']); // View all centers
Route::get('/relief-centers/{id}', [ReliefCenterController::class, 'show']);


/*
|--------------------------------------------------------------------------
| resources Routes
|--------------------------------------------------------------------------
*/


Route::post('/resources', [ResourceController::class, 'store']);
Route::put('/resources/{id}', [ResourceController::class, 'update']);
Route::delete('/resources/{id}', [ResourceController::class, 'destroy']);
Route::get('/resources', [ResourceController::class, 'index']); // View all resources
Route::get('/resources/{id}', [ResourceController::class, 'show']); // View a single resource
Route::post('/resources/donation/{donation}', [ResourceController::class, 'handleDonation']); // Auto-update on donation
Route::post('/resources/aid-prep/{aidPreparation}', [ResourceController::class, 'handleAidPreparation']); // Auto-deduct for aid


/*
|--------------------------------------------------------------------------
| donations Routes
|--------------------------------------------------------------------------
*/

Route::post('/donations', [DonationController::class, 'create']);
Route::middleware('auth:api')->group(function () {
    // Route for users to view their donations history
    Route::get('/donations/history', [DonationController::class, 'userDonations']);

    // Route for admins to view all donations history
    Route::get('/donations/all', [DonationController::class, 'allDonations']);
});