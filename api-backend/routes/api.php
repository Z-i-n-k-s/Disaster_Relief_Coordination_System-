<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\ReliefCenterController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;




/*
|--------------------------------------------------------------------------
| auth Routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/logout', [AuthController::class, 'logout'])->middleware(AuthMiddleware::class); 

Route::middleware(['jwt.auth'])->group(function () {
    
    Route::get('/me', [AuthController::class, 'me']);
});
Route::get('token/refresh', [AuthController::class, 'refreshToken']);

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

    // Route for users to view their donations history
    Route::get('/donations/history', [DonationController::class, 'userDonations'])->middleware(AuthMiddleware::class); 
    
Route::middleware('auth:api')->group(function () {
    // Route for admins to view all donations history
    Route::get('/donations/all', [DonationController::class, 'allDonations']);
});

/*
|--------------------------------------------------------------------------
| donations Routes
|--------------------------------------------------------------------------
*/

Route::get('/users', [UserController::class, 'index']); // Get all users
Route::get('/users/currentUser', [UserController::class, 'show'])
     ->middleware(AuthMiddleware::class); // Get user by ID with volunteer info
Route::get('/volunteers', [UserController::class, 'showAllVolunteers']); // Get all volunteers
Route::post('/users', [UserController::class, 'store']); // Create user
Route::put('/users/{id}', [UserController::class, 'update']); // Update user
Route::delete('/users/{id}', [UserController::class, 'destroy']); // Delete user