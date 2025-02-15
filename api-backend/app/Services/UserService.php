<?php

namespace App\Services;

use App\Models\AidRequest;
use App\Models\Donation;
use App\Models\ReliefCenter;
use App\Models\User;
use App\Models\Volunteer;

class UserService
{
    /**
     * Get all users.
     */
    public function getAllUsers()
    {
        $users = User::all();

        // Append additional info based on role
        $usersWithInfo = $users->map(function ($user) {
            // For regular users: count donations and aid requests.
            if ($user->Role === 'User') {
                $user->donationsCount   = Donation::where('UserID', $user->UserID)->count();
                $user->aidRequestsCount = AidRequest::where('UserID', $user->UserID)->count();
            }
            // For volunteers: get assigned center information.
            else if ($user->Role === 'Volunteer') {
                $volunteer = Volunteer::where('UserID', $user->UserID)->first();
                if ($volunteer) {
                    // Get the assigned center info (if any).
                    $user->assignedCenter = ReliefCenter::find($volunteer->AssignedCenter);
                } else {
                    $user->assignedCenter = null;
                }
            }
            // For managers: get all centers managed by this user.
            else if ($user->Role === 'Manager') {
                $user->managedCenters = ReliefCenter::where('ManagerID', $user->UserID)->get();
            }

            

            return $user;
        });

        return $usersWithInfo;
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
    /**
 * Update an existing user.
 */
public function updateUser($userId, $data)
{
    // Find the existing user; throws an exception if not found.
    $user = User::findOrFail($userId);
    $oldRole = $user->Role;

    // If the user was previously a Volunteer, get the volunteer record.
    $oldVolunteer = null;
    if ($oldRole === 'Volunteer') {
        $oldVolunteer = Volunteer::where('UserID', $userId)->first();
    }

    // Update the user with the provided data.
    $user->update($data);
    $newRole = $user->Role; // New role after update

    // Check if an assigned center is provided in the update data.
    $assignedCenterProvided = isset($data['AssignedCenter']) ? $data['AssignedCenter'] : null;

    // --- Case 1: Transition from a non-volunteer role to Volunteer ---
    if ($oldRole !== 'Volunteer' && $newRole === 'Volunteer') {
        if ($assignedCenterProvided) {
            // Create a new volunteer record for the user.
            $volunteer = new Volunteer();
            $volunteer->Name = $user->Name;
            // You may set ContactInfo as needed; here we use PhoneNo as a placeholder.
            $volunteer->ContactInfo = $user->PhoneNo; 
            $volunteer->AssignedCenter = $assignedCenterProvided;
            $volunteer->Status = 'Active'; // Set a default status
            $volunteer->UserID = $userId;
            $volunteer->save();

            // Update the relief center's volunteer count.
            $newCount = Volunteer::where('AssignedCenter', $assignedCenterProvided)->count();
            ReliefCenter::where('CenterID', $assignedCenterProvided)
                ->update(['NumberOfVolunteersWorking' => $newCount]);
        }
    }
    // --- Case 2: Volunteer remains Volunteer, possibly with a changed assigned center ---
    elseif ($oldRole === 'Volunteer' && $newRole === 'Volunteer') {
        if ($assignedCenterProvided && $oldVolunteer) {
            $oldAssignedCenter = $oldVolunteer->AssignedCenter;
            $newAssignedCenter = $assignedCenterProvided;
            // If the assigned center has changed, update the volunteer record and adjust counts.
            if ($oldAssignedCenter != $newAssignedCenter) {
                $oldVolunteer->AssignedCenter = $newAssignedCenter;
                $oldVolunteer->save();

                // Recalculate and update the volunteer count for the old assigned center.
                $oldCount = Volunteer::where('AssignedCenter', $oldAssignedCenter)->count();
                ReliefCenter::where('CenterID', $oldAssignedCenter)
                    ->update(['NumberOfVolunteersWorking' => $oldCount]);

                // Recalculate and update the volunteer count for the new assigned center.
                $newCount = Volunteer::where('AssignedCenter', $newAssignedCenter)->count();
                ReliefCenter::where('CenterID', $newAssignedCenter)
                    ->update(['NumberOfVolunteersWorking' => $newCount]);
            }
        }
    }
    // --- Case 3: Transition from Volunteer to a non-volunteer role ---
    elseif ($oldRole === 'Volunteer' && $newRole !== 'Volunteer') {
        if ($oldVolunteer) {
            $oldAssignedCenter = $oldVolunteer->AssignedCenter;
            // Delete the volunteer record.
            $oldVolunteer->delete();

            // Update the relief center's volunteer count for the previously assigned center.
            $newCount = Volunteer::where('AssignedCenter', $oldAssignedCenter)->count();
            ReliefCenter::where('CenterID', $oldAssignedCenter)
                ->update(['NumberOfVolunteersWorking' => $newCount]);
        }
    }
    // For other role changes (non-volunteer to non-volunteer), no volunteer table or center count updates are needed.

    return $user;
}


    /**
     * Delete a user.
     */
    public function deleteUser($UserID)
    {
        // Find the user; if not found, this will throw an exception.
        $user = User::findOrFail($UserID);
    
        // If the user is a Volunteer, delete their volunteer record and update the relief center.
        if ($user->Role === 'Volunteer') {
            // Retrieve the volunteer record associated with the user.
            $volunteer = Volunteer::where('UserID', $UserID)->first();
    
            if ($volunteer) {
                // Store the assigned center ID before deletion.
                $assignedCenter = $volunteer->AssignedCenter;
    
                // Delete the volunteer record.
                Volunteer::where('UserID', $UserID)->delete();
    
                // Recalculate the number of volunteers working in the assigned center.
                $newCount = Volunteer::where('AssignedCenter', $assignedCenter)->count();
    
                // Update the relief center's NumberOfVolunteersWorking field.
               ReliefCenter::where('CenterID', $assignedCenter)
                    ->update(['NumberOfVolunteersWorking' => $newCount]);
            }
        }
    
        // Finally, delete the user.
        return $user->delete();
    }
    

}
