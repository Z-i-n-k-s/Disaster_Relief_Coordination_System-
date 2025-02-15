<?php

namespace App\Services;

use App\Models\User;
use App\Models\Volunteer;

class UserService
{
    /**
     * Get all users.
     */
    public function getAllUsers()
    {
        return User::all();
    }

    /**
     * Get a single user along with volunteer and relief center info (if available).
     */
    public function getUserWithVolunteerInfo($userId)
    {
        return User::with('volunteer.reliefCenter')->findOrFail($userId);
    }

    /**
     * Get all volunteers with their assigned relief center details.
     */
    public function getAllVolunteers()
    {
        return Volunteer::with('reliefCenter')->get();
    }

    /**
     * Create a new user.
     */
    public function createUser($data)
    {
        return User::create($data);
    }

    /**
     * Update an existing user.
     */
    public function updateUser($userId, $data)
    {
        $user = User::findOrFail($userId);
        $user->update($data);
        return $user;
    }

    /**
     * Delete a user.
     */
    public function deleteUser($userId)
    {
        return User::destroy($userId);
    }
}
