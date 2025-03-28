<?php
namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon; // Import Carbon to handle timestamps

class AuthService
{
    /**
     * Register a new regular user.
     */
    public function registerUser($data)
    {
        return DB::transaction(function () use ($data) {
            DB::insert(
                "INSERT INTO users (Email, Name, Password, Role, PhoneNo, created_at)
                 VALUES (?, ?, ?, ?, ?, ?)",
                [
                    $data['Email'],
                    $data['Name'],
                    Hash::make($data['Password']),
                    'User',
                    $data['PhoneNo'],
                    Carbon::now()  // Sets the current timestamp
                ]
            );

            $userId = DB::getPdo()->lastInsertId();
            $user   = DB::select("SELECT * FROM users WHERE UserID = ?", [$userId]);

            return $user[0] ?? null;
        });
    }

    /**
     * Register a new volunteer user.
     */
    public function registerVolunteer($data)
    {
        return DB::transaction(function () use ($data) {
            // Insert into users table with created_at timestamp
            DB::insert(
                "INSERT INTO users (Email, Name, Password, Role, PhoneNo, created_at)
                 VALUES (?, ?, ?, ?, ?, ?)",
                [
                    $data['Email'],
                    $data['Name'],
                    Hash::make($data['Password']),
                    'Volunteer',
                    $data['PhoneNo'],
                    Carbon::now()
                ]
            );
            $userId = DB::getPdo()->lastInsertId();

            // Insert into volunteers table with created_at timestamp (if the column exists)
            DB::insert(
                "INSERT INTO volunteers (Name, ContactInfo, AssignedCenter, Status, UserID, created_at)
                 VALUES (?, ?, ?, ?, ?, ?)",
                [
                    $data['Name'],
                    $data['PhoneNo'],
                    $data['AssignedCenter'],  // references relief_centers.CenterID
                    'Active',
                    $userId,
                    Carbon::now()
                ]
            );

            // Update relief center volunteer count using a subquery
            DB::update(
                "UPDATE relief_centers
                 SET NumberOfVolunteersWorking = (
                     SELECT COUNT(*) FROM volunteers WHERE AssignedCenter = ?
                 )
                 WHERE CenterID = ?",
                [$data['AssignedCenter'], $data['AssignedCenter']] 
            );

            $user = DB::select("SELECT * FROM users WHERE UserID = ?", [$userId]);
            return $user[0] ?? null;
        });
    }

    /**
     * Login logic (basic example).
     */
    public function login($data)
    {
        $userArr = DB::select(
            "SELECT * FROM users WHERE Email = ? LIMIT 1",
            [$data['Email']]
        );

        if (empty($userArr)) {
            return response()->json(['error' => 'Invalid email address'], 401);
        }

        $user = $userArr[0];
        if (!Hash::check($data['Password'], $user->Password)) {
            return response()->json(['error' => 'Incorrect password'], 401);
        }

        return $user;
    }

    /**
     * Logout logic (dummy example).
     */
    public function logout($userId)
    {
        return $userId ? true : false;
    }
}
