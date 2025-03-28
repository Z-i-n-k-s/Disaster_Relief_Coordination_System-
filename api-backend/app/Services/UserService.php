<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class UserService
{
    protected function getUserById($userId)
    {
        $result = DB::select("SELECT * FROM users WHERE UserID = ? LIMIT 1", [$userId]);
        if (empty($result)) {
            throw new ModelNotFoundException("User not found.");
        }
        return $result[0];
    }

    /**
     * Retrieve all users with donation/aid request counts, plus extra info for volunteers & managers.
     */
    public function getAllUsers()
    {
        // Subqueries for donation/aid_request counts
        $sql = "
            SELECT u.*,
                (SELECT COUNT(*) FROM donations d WHERE d.UserID = u.UserID) AS donationsCount,
                (SELECT COUNT(*) FROM aid_requests ar WHERE ar.UserID = u.UserID) AS aidRequestsCount
            FROM users u
        ";
        $users = DB::select($sql);

        // For volunteers, fetch assigned center. For managers, fetch managed centers.
        foreach ($users as &$user) {
            if ($user->Role === 'Volunteer') {
                $volunteerArr = DB::select("SELECT * FROM volunteers WHERE UserID = ? LIMIT 1", [$user->UserID]);
                if (!empty($volunteerArr)) {
                    $volunteer       = $volunteerArr[0];
                    $centerArr       = DB::select("SELECT * FROM relief_centers WHERE CenterID = ? LIMIT 1", [$volunteer->AssignedCenter]);
                    $user->assignedCenter = !empty($centerArr) ? $centerArr[0] : null;
                } else {
                    $user->assignedCenter = null;
                }
            } elseif ($user->Role === 'Manager') {
                $managedCenters = DB::select("SELECT * FROM relief_centers WHERE ManagerID = ?", [$user->UserID]);
                $user->managedCenters = $managedCenters;
            }
        }

        return $users;
    }

    /**
     * Get a single user with volunteer info (if volunteer).
     */
    public function getUserWithVolunteerInfo($userId)
    {
        $user = $this->getUserById($userId);
        if ($user->Role === 'Volunteer') {
            $volunteerArr = DB::select("SELECT * FROM volunteers WHERE UserID = ? LIMIT 1", [$userId]);
            if (!empty($volunteerArr)) {
                $volunteer = $volunteerArr[0];
                $centerArr = DB::select("SELECT * FROM relief_centers WHERE CenterID = ? LIMIT 1", [$volunteer->AssignedCenter]);
                $volunteer->reliefCenter = !empty($centerArr) ? $centerArr[0] : null;
                $user->volunteer = $volunteer;
            } else {
                $user->volunteer = null;
            }
        }
        return $user;
    }

    /**
     * Get all volunteers (and their assigned relief center).
     */
    public function getAllVolunteers()
    {
        $volunteers = DB::select("SELECT * FROM volunteers");
        foreach ($volunteers as &$volunteer) {
            $centerArr = DB::select("SELECT * FROM relief_centers WHERE CenterID = ? LIMIT 1", [$volunteer->AssignedCenter]);
            $volunteer->reliefCenter = !empty($centerArr) ? $centerArr[0] : null;
        }
        return $volunteers;
    }

    /**
     * Create a new user.
     */
    public function createUser($data)
    {
        return DB::transaction(function () use ($data) {
            $columns = array_keys($data);
            $values  = array_values($data);
            $placeholders = implode(', ', array_fill(0, count($data), '?'));
            $columnsStr   = implode(', ', $columns);

            DB::insert("INSERT INTO users ($columnsStr) VALUES ($placeholders)", $values);
            $userId = DB::getPdo()->lastInsertId();

            return $this->getUserById($userId);
        });
    }

    /**
     * Update a user and handle volunteer role transitions.
     */
    public function updateUser($userId, $data)
{
    return DB::transaction(function () use ($userId, $data) {
        $user = $this->getUserById($userId);
        $oldRole = $user->Role;

        // If old role was volunteer, fetch the volunteer record
        $oldVolunteer = null;
        if ($oldRole === 'Volunteer') {
            $volArr = DB::select("SELECT * FROM volunteers WHERE UserID = ? LIMIT 1", [$userId]);
            if (!empty($volArr)) {
                $oldVolunteer = $volArr[0];
            }
        }

        // Only update allowed columns from the users table
        $allowedUserColumns = ['Email', 'Name', 'Password', 'Role', 'PhoneNo'];
        $userData = array_intersect_key($data, array_flip($allowedUserColumns));
        if (!empty($userData)) {
            $columns = array_keys($userData);
            $values  = array_values($userData);
            $setClause = implode(', ', array_map(fn($col) => "$col = ?", $columns));

            DB::update(
                "UPDATE users SET $setClause WHERE UserID = ?",
                array_merge($values, [$userId])
            );
        }

        // Refresh the user record after updating
        $user = $this->getUserById($userId);
        $newRole = $user->Role;
        $assignedCenterProvided = $data['AssignedCenter'] ?? null;

        // 1) Non-volunteer -> Volunteer
        if ($oldRole !== 'Volunteer' && $newRole === 'Volunteer' && $assignedCenterProvided) {
            DB::insert(
                "INSERT INTO volunteers (Name, ContactInfo, AssignedCenter, Status, UserID)
                 VALUES (?, ?, ?, ?, ?)",
                [$user->Name, $user->PhoneNo, $assignedCenterProvided, 'Active', $userId]
            );
            DB::update(
                "UPDATE relief_centers
                 SET NumberOfVolunteersWorking = (
                     SELECT COUNT(*) FROM volunteers WHERE AssignedCenter = ?
                 )
                 WHERE CenterID = ?",
                [$assignedCenterProvided, $assignedCenterProvided]
            );
        }
        // 2) Volunteer -> Volunteer (possible change of center)
        elseif ($oldRole === 'Volunteer' && $newRole === 'Volunteer' && $assignedCenterProvided && $oldVolunteer) {
            $oldAssignedCenter = $oldVolunteer->AssignedCenter;
            $newAssignedCenter = $assignedCenterProvided;
            if ($oldAssignedCenter != $newAssignedCenter) {
                // Update volunteer record
                DB::update(
                    "UPDATE volunteers SET AssignedCenter = ? WHERE UserID = ?",
                    [$newAssignedCenter, $userId]
                );
                // Update old center count
                DB::update(
                    "UPDATE relief_centers
                     SET NumberOfVolunteersWorking = (
                         SELECT COUNT(*) FROM volunteers WHERE AssignedCenter = ?
                     )
                     WHERE CenterID = ?",
                    [$oldAssignedCenter, $oldAssignedCenter]
                );
                // Update new center count
                DB::update(
                    "UPDATE relief_centers
                     SET NumberOfVolunteersWorking = (
                         SELECT COUNT(*) FROM volunteers WHERE AssignedCenter = ?
                     )
                     WHERE CenterID = ?",
                    [$newAssignedCenter, $newAssignedCenter]
                );
            }
        }
        // 3) Volunteer -> Non-volunteer
        elseif ($oldRole === 'Volunteer' && $newRole !== 'Volunteer' && $oldVolunteer) {
            $oldAssignedCenter = $oldVolunteer->AssignedCenter;
            DB::delete("DELETE FROM volunteers WHERE UserID = ?", [$userId]);
            DB::update(
                "UPDATE relief_centers
                 SET NumberOfVolunteersWorking = (
                     SELECT COUNT(*) FROM volunteers WHERE AssignedCenter = ?
                 )
                 WHERE CenterID = ?",
                [$oldAssignedCenter, $oldAssignedCenter]
            );
        }

        return $user;
    });
}

    /**
     * Delete a user. If volunteer, remove volunteer record and update the center count.
     */
    public function deleteUser($userId)
{
    return DB::transaction(function () use ($userId) {
        $user = $this->getUserById($userId);

        // If volunteer, delete volunteer record and update center count
        if ($user->Role === 'Volunteer') {
            $volArr = DB::select("SELECT * FROM volunteers WHERE UserID = ? LIMIT 1", [$userId]);
            if (!empty($volArr)) {
                $volunteer = $volArr[0];
                $assignedCenter = $volunteer->AssignedCenter;

                DB::delete("DELETE FROM volunteers WHERE UserID = ?", [$userId]);
                DB::update(
                    "UPDATE relief_centers
                     SET NumberOfVolunteersWorking = (
                         SELECT COUNT(*) FROM volunteers WHERE AssignedCenter = ?
                     )
                     WHERE CenterID = ?",
                    [$assignedCenter, $assignedCenter]
                );
            }
        }

        // Remove foreign key references in donations by setting UserID to null
        DB::update("UPDATE donations SET UserID = NULL WHERE UserID = ?", [$userId]);

        // Finally, delete the user record
        DB::delete("DELETE FROM users WHERE UserID = ?", [$userId]);
        return true;
    });
}

}
