<?php

namespace App\Services;

use App\Models\ReliefCenter;
use App\Models\User;
use App\Models\Volunteer;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\UnauthorizedException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function registerUser($data)
    {
        return User::create([
            'Email' => $data['Email'],
            'Name' => $data['Name'],
            'Password' => Hash::make($data['Password']),
            'Role' => 'User',
            'PhoneNo' => $data['PhoneNo'],
        ]);
    }

    public function registerVolunteer($data)
    {
        // Create a new user
        $user = User::create([
            'Email' => $data['Email'],
            'Name' => $data['Name'],
            'Password' => Hash::make($data['Password']),
            'Role' => 'Volunteer',
            'PhoneNo' => $data['PhoneNo'],
        ]);
    
        // Create a new volunteer and associate with the user
        $volunteer = Volunteer::create([
            'Name' => $data['Name'],
            'ContactInfo' => $data['PhoneNo'],
            'AssignedCenter' => $data['AssignedCenter'],
            'Status' => 'Active',
            'UserID' => $user->UserID,
        ]);
    
        // Find the associated ReliefCenter and increment the number of volunteers
        $reliefCenter = ReliefCenter::find($data['AssignedCenter']);
        
        // Increment the NumberOfVolunteersWorking by 1
        $reliefCenter->increment('NumberOfVolunteersWorking');
    
        return $user;
    }
    

    public function login($data)
    {
        // Fetch the user by email
        $user = User::where('Email', $data['Email'])->first();

        // Check if the user exists
        if (!$user) {
            return response()->json(['error' => 'Invalid email address'], 401); // Unauthorized
        }

        // Validate the password
        if (!Hash::check($data['Password'], $user->Password)) {
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
