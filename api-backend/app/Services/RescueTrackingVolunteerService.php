<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class RescueTrackingVolunteerService
{
    public function getAll()
    {
        $sql = "SELECT * FROM rescue_tracking_volunteers";
        return DB::select($sql);
    }

    public function create(int $trackingId, int $volunteerId)
{
    // Check if a record with the given VolunteerID already exists.
    $sqlSelect = "SELECT * FROM rescue_tracking_volunteers WHERE TrackingID = ?";
    $existing = DB::selectOne($sqlSelect, [$trackingId]);

    if ($existing) {
        // Return the existing record if found.
        return ;
    }
    
    // Insert new record since it doesn't exist.
    $sqlInsert = "
        INSERT INTO rescue_tracking_volunteers (TrackingID, VolunteerID)
        VALUES (?, ?)
    ";

    DB::insert($sqlInsert, [$trackingId, $volunteerId]);

    // Retrieve and return the new record.
    return DB::selectOne($sqlSelect, [$volunteerId]);
}

}
