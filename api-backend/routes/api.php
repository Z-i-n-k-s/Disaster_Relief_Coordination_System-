<?php

use App\Http\Controllers\AffectedAreaController;
use App\Http\Controllers\AidPrepController;
use App\Http\Controllers\AidRequestController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\ReliefCenterController;
use App\Http\Controllers\RescueTrackingController;
use App\Http\Controllers\RescueTrackingVolunteerController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VolunteerTaskController;
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
Route::get('relief-centers', [ReliefCenterController::class, 'index']);
Route::prefix('relief-centers')->group(function () {
    Route::post('/', [ReliefCenterController::class, 'store']);
    Route::put('/{id}', [ReliefCenterController::class, 'update']);
    Route::delete('/{id}', [ReliefCenterController::class, 'destroy']);
    
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

/*
|---------------------------------------------------------------------------
| aid-request Routes
|---------------------------------------------------------------------------
*/

Route::prefix('aid-requests')->group(function () {
    Route::get('/user/{userId}', [AidRequestController::class, 'getUserRequests']);
    Route::patch('/{id}/status', [AidRequestController::class, 'updateStatus']);
    Route::patch('/{id}/response-time', [AidRequestController::class, 'updateResponseTime']);

    Route::get('/', [AidRequestController::class, 'index']);      // List all aid requests
    Route::post('/', [AidRequestController::class, 'store']);     // Create a new aid request
    Route::get('/{id}', [AidRequestController::class, 'show']);     // Get a specific aid request
    Route::put('/{id}', [AidRequestController::class, 'update']);   // Update an existing aid request
    Route::delete('/{id}', [AidRequestController::class, 'destroy']); // Delete an aid request
});

/*
|---------------------------------------------------------------------------
| affected-areas Routes
|---------------------------------------------------------------------------
*/

Route::prefix('affected-areas')->group(function () {
    Route::get('/', [AffectedAreaController::class, 'index']);      // List all affected areas
    Route::post('/', [AffectedAreaController::class, 'store']);     // Create a new affected area
    Route::get('/{id}', [AffectedAreaController::class, 'show']);     // Retrieve a specific affected area
    Route::put('/{id}', [AffectedAreaController::class, 'update']);   // Update an existing affected area
    Route::delete('/{id}', [AffectedAreaController::class, 'destroy']); // Delete an affected area
});


/*
|---------------------------------------------------------------------------
| aid-prep Routes
|---------------------------------------------------------------------------
*/

Route::prefix('aid-preparation')->group(function () {
    // Aid Preparation endpoints
    Route::post('/', [AidPrepController::class, 'create']);
    Route::patch('/{preparationId}/times', [AidPrepController::class, 'updateTimes']);
    Route::get('/full-details', [AidPrepController::class, 'getAllAidPrepDetails']);



    Route::patch('/{preparationId}/status', [AidPrepController::class, 'updateStatus']);

    // Volunteer endpoints
    Route::post('/{preparationId}/volunteers', [AidPrepController::class, 'addVolunteer']);
    Route::get('/{preparationId}/volunteers', [AidPrepController::class, 'getVolunteers']);
    Route::get('/{preparationId}/status', [AidPrepController::class, 'getAidPrepStatus']);
    Route::patch('/volunteers/{volunteerRecordId}', [AidPrepController::class, 'updateVolunteer']);
    Route::delete('/volunteers/{volunteerRecordId}', [AidPrepController::class, 'deleteVolunteer']);

    // Resource Usage endpoints
    Route::post('/{preparationId}/resources', [AidPrepController::class, 'addResource']);
    Route::get('/{preparationId}/resources', [AidPrepController::class, 'getResources']);
    Route::patch('/resources/{usageRecordId}', [AidPrepController::class, 'updateResource']);
    Route::delete('/resources/{usageRecordId}', [AidPrepController::class, 'deleteResource']);
});

/*
|---------------------------------------------------------------------------
| volunteer tasks Routes
|---------------------------------------------------------------------------
*/
Route::get('/volunteers/{volunteerId}/aid-prep-tasks', [VolunteerTaskController::class, 'getAidPrepTasks']);
Route::get('/volunteers/{volunteerId}/rescue-tracking-tasks', [VolunteerTaskController::class, 'getRescueTrackingTasks']);



// Rescue Tracking endpoints
Route::post('/rescue-tracking', [RescueTrackingController::class, 'store']);
Route::patch('/rescue-tracking/{id}', [RescueTrackingController::class, 'update']);
Route::get('/rescue-tracking/{id}', [RescueTrackingController::class, 'show']);
Route::get('/tracking', [RescueTrackingController::class, 'index']);

// Rescue Tracking Volunteers endpoints (only create and read)
Route::get('/rescue-tracking-volunteers', [RescueTrackingVolunteerController::class, 'index']);
Route::post('/rescue-tracking-volunteers', [RescueTrackingVolunteerController::class, 'store']);
