<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    // Retrieve all users with additional role-based information.
    public function index()
    {
        try {
            $users = $this->userService->getAllUsers();
            return response()->json([
                'success' => true,
                'error'   => false,
                'data'    => $users
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error retrieving users: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Get a single user with volunteer and relief center details.
    public function show(Request $request)
    {
        $userId = $request->attributes->get('userId');

        if (!$userId) {
            return response()->json([
                'success' => false,
                'error'   => true,
                'message' => 'User ID not provided'
            ], Response::HTTP_BAD_REQUEST);
        }

        try {
            $user = $this->userService->getUserWithVolunteerInfo($userId);
            return response()->json([
                'success' => true,
                'error'   => false,
                'data'    => $user
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error'   => true,
                'message' => 'User not found: ' . $e->getMessage()
            ], Response::HTTP_NOT_FOUND);
        }
    }

    // Retrieve all volunteers with their assigned relief centers.
    public function showAllVolunteers()
    {
        try {
            $volunteers = $this->userService->getAllVolunteers();
            return response()->json([
                'success' => true,
                'error'   => false,
                'data'    => $volunteers
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error retrieving volunteers: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Create a new user.
    public function store(Request $request)
    {
        $validated = $request->validate([
            'Email'    => 'required|email|unique:users,Email',
            'Name'     => 'required|string|max:255',
            'Password' => 'required|min:6',
            'Role'     => 'required|in:Manager,User,Volunteer',
            'PhoneNo'  => 'nullable|string|max:20',
        ]);

        try {
            $user = $this->userService->createUser($validated);
            return response()->json([
                'success' => true,
                'error'   => false,
                'data'    => $user
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'User creation failed: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Update an existing user.
    public function update(Request $request, $id)
{
    $validated = $request->validate([
        'Email'           => 'sometimes|email|unique:users,Email,' . $id . ',UserID',
        'Name'            => 'sometimes|string|max:255',
        'Password'        => 'sometimes|min:6',
        'Role'            => 'sometimes|in:Manager,User,Volunteer',
        'PhoneNo'         => 'nullable|string|max:20',
        'AssignedCenter'  => 'nullable|integer|exists:relief_centers,CenterID',
    ]);

    try {
        // Pass the validated array instead of the Request object
        $user = $this->userService->updateUser($id, $validated);
        return response()->json([
            'success' => true,
            'error'   => false,
            'data'    => $user
        ]);
    } catch (\Exception $e) {
        error_log($e);
        return response()->json([
            'success' => false,
            'error'   => true,
            'message' => 'User not found'
        ], 404);
    }
}


    // Delete a user.
    public function destroy($id)
    {
        try {
            $this->userService->deleteUser($id);
            return response()->json([
                'success' => true,
                'error'   => false,
                'message' => 'User deleted successfully'
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error'   => true,
                'message' => 'User deletion failed: ' . $e->getMessage()
            ], Response::HTTP_NOT_FOUND);
        }
    }
}
