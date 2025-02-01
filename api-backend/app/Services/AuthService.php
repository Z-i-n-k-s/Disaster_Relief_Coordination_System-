<?php

namespace App\Services;

use App\Models\Admin;
use App\Models\RegularUser;
use App\Models\User;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Voluenter;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\UnauthorizedException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthService
{
    public function register(array $data)
    {
        // Save the user data to the `users` table, always defaulting to 'student' role
        $user = User::create([
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'student', // Default role
        ]);

        // Check user role and save to the appropriate table
        if ($user->role == 'admin') {
            // Save admin data
            Admin::create([
                'user_id' => $user->id,
                'name' => $data['name'],

            ]);
        } elseif ($user->role == 'regularuser') {
            // Save regularuser data
            RegularUser::create([
                'user_id' => $user->id,
                'name' => $data['name'],

            ]);
        } elseif ($user->role == 'voluenter') {
            // Save voluenter data
            Voluenter::create([
                'user_id' => $user->id,
                'name' => $data['name'],
            ]);
        }

        return $user; // Return the user object after registration
    }

    public function login($data)
    {
        // Fetch the user by email
        $user = User::where('email', $data['email'])->first();

        // Check if the user exists
        if (!$user) {
            return response()->json(['error' => 'Invalid email address'], 401); // Unauthorized
        }

        // Validate the password
        if (!Hash::check($data['password'], $user->password)) {
            return response()->json(['error' => 'Incorrect password'], 401); // Unauthorized
        }

        // Return the authenticated user
        return $user;
    }

    public function logout()
    {
        // Retrieve the token from the request
        $token = JWTAuth::getToken();
    
        if (!$token) {
            return response()->json([
                'success' => false,
                'error' => true,
                'message' => 'Token not provided',
            ], 401);
        }
    
        try {
            // Invalidate the access token
            JWTAuth::invalidate($token);
    
            // Clear access and refresh tokens from cookies
            return true;
            
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            throw new UnauthorizedException('Failed to log out');
           
        }
    }
}
