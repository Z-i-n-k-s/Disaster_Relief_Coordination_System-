<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Get all users.
     */
    public function index()
    {
        $users = $this->userService->getAllUsers();
        return response()->json([
            'success' => true,
            'error'   => false,
            'data'    => $users
        ]);
    }

    /**
     * Get a single user by ID with volunteer and relief center details (if available).
     */
    public function show(Request $request)
    {
        // Extract the userId set by the middleware
        $userId = $request->attributes->get('userId');

        if (!$userId) {
            return response()->json([
                'success' => false,
                'error'   => true,
                'message' => 'User ID not provided'
            ], 400);
        }

        try {
            $user = $this->userService->getUserWithVolunteerInfo($userId);
            return response()->json([
                'success' => true,
                'error'   => false,
                'data'    => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error'   => true,
                'message' => 'User not found'
            ], 404);
        }
    }

    /**
     * Get all volunteers along with their assigned relief centers.
     */
    public function showAllVolunteers()
    {
        $volunteers = $this->userService->getAllVolunteers();
        return response()->json([
            'success' => true,
            'error'   => false,
            'data'    => $volunteers
        ]);
    }

    /**
     * Create a new user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'Email'    => 'required|email|unique:users,Email',
            'Name'     => 'required|string|max:255',
            'Password' => 'required|min:6',
            'Role'     => 'required|in:Manager,User,Volunteer',
            'PhoneNo'  => 'nullable|string|max:20',
        ]);

        $user = $this->userService->createUser($validated);
        return response()->json([
            'success' => true,
            'error'   => false,
            'data'    => $user
        ], 201);
    }

    /**
     * Update an existing user.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'Email'    => 'sometimes|email|unique:users,Email,' . $id . ',UserID',
            'Name'     => 'sometimes|string|max:255',
            'Password' => 'sometimes|min:6',
            'Role'     => 'sometimes|in:Manager,User,Volunteer',
            'PhoneNo'  => 'nullable|string|max:20',
        ]);

        try {
            $user = $this->userService->updateUser($id, $validated);
            return response()->json([
                'success' => true,
                'error'   => false,
                'data'    => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error'   => true,
                'message' => 'User not found'
            ], 404);
        }
    }

    /**
     * Delete a user.
     */
    public function destroy($id)
    {
        try {
            $this->userService->deleteUser($id);
            return response()->json([
                'success' => true,
                'error'   => false,
                'message' => 'User deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error'   => true,
                'message' => 'User not found'
            ], 404);
        }
    }
}
