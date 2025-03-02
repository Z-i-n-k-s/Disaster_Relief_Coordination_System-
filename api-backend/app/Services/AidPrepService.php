<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Exception;

class AidPrepService
{
    /**
     * Create a new aid preparation record.
     * Uses a placeholder date for DepartureTime and EstimatedArrival.
     * Throws an exception if an aid prep already exists for the given RequestID.
     */
    public function createAidPreparation($requestId)
    {
        // Check if an aid preparation already exists for this RequestID
        $existing = DB::select('SELECT * FROM aid_preparation WHERE RequestID = ?', [$requestId]);
        if (!empty($existing)) {
            // Return the existing record if found
            return $existing[0];
        }

        // Use placeholder dates – these will be updated later via updateAidPreparationTimes().
        $placeholder = '1970-01-01 00:00:00';
        $status = 'Pending';

        DB::insert(
            'INSERT INTO aid_preparation (RequestID, DepartureTime, EstimatedArrival, Status, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
            [$requestId, $placeholder, $placeholder, $status]
        );

        // Retrieve and return the newly inserted record.
        $prep = DB::select('SELECT * FROM aid_preparation WHERE RequestID = ? LIMIT 1', [$requestId]);
        return $prep[0];
    }


    /**
     * Update the DepartureTime and EstimatedArrival for a given aid preparation.
     */
    public function updateAidPreparationTimes($preparationId, $departureTime, $estimatedArrival)
    {
        $updated = DB::update(
            'UPDATE aid_preparation SET DepartureTime = ?, EstimatedArrival = ?, updated_at = NOW() WHERE PreparationID = ?',
            [$departureTime, $estimatedArrival, $preparationId]
        );
        if ($updated === 0) {
            throw new Exception('Aid preparation record not found.');
        }
        return true;
    }

    /////////////////// Volunteer CRUD ///////////////////
    public function createVolunteer($preparationId, $volunteerId)
    {
        // Optional: Check if the volunteer exists in the volunteers table.
        $volunteerExists = DB::select('SELECT VolunteerID FROM volunteers WHERE VolunteerID = ?', [$volunteerId]);
        if (empty($volunteerExists)) {
            throw new Exception('Volunteer does not exist in the system.');
        }
        
    
        // Check if the volunteer is already added for this aid preparation.
        $existing = DB::select(
            'SELECT * FROM aid_preparation_volunteers WHERE PreparationID = ? AND VolunteerID = ? LIMIT 1',
            [$preparationId, $volunteerId]
        );
    
        if (!empty($existing)) {
            // Return the existing volunteer record.
            return $existing[0];
        }
        
        // Insert a new record if none exists.
        DB::insert(
            'INSERT INTO aid_preparation_volunteers (PreparationID, VolunteerID, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
            [$preparationId, $volunteerId]
        );
        $id = DB::getPdo()->lastInsertId();
        $volunteer = DB::select('SELECT * FROM aid_preparation_volunteers WHERE ID = ? LIMIT 1', [$id]);
        return $volunteer[0];
    }
    

    

    public function getVolunteers($requestId)
    {
        $sql = 'SELECT * FROM aid_preparation_volunteers 
                WHERE PreparationID IN (
                    SELECT PreparationID FROM aid_preparation WHERE RequestID = ?
                )';
        return DB::select($sql, [$requestId]);
    }

    public function getAidPrepStatus($requestId)
    {
        $sql = 'SELECT Status FROM aid_preparation WHERE RequestID = ?';
        $result = DB::select($sql, [$requestId]);
    
        if (empty($result)) {
            throw new \Exception('ID not Valid');
        }
    
        return $result[0]->Status;
    }
    



public function getFullAidPrepDetails()
{
    // Retrieve all records from the AidPreparation table.
    $aidPreps = DB::select('SELECT * FROM aid_preparation');

    if (empty($aidPreps)) {
        throw new \Exception("No aid preparation records found.");
    }

    // Loop through each aid preparation record.
    foreach ($aidPreps as $prep) {
        // Fetch the aid request info using the RequestID from the aid preparation record.
        $requestInfo = DB::select('SELECT * FROM aid_requests WHERE RequestID = ? LIMIT 1', [$prep->RequestID]);
        $prep->requestInfo = !empty($requestInfo) ? $requestInfo[0] : null;

    }

    return $aidPreps;
}



    public function updateVolunteer($volunteerRecordId, $volunteerId)
    {
        $updated = DB::update(
            'UPDATE aid_preparation_volunteers SET VolunteerID = ?, updated_at = NOW() WHERE ID = ?',
            [$volunteerId, $volunteerRecordId]
        );
        if ($updated === 0) {
            throw new Exception('Volunteer record not found.');
        }
        return true;
    }

    public function deleteVolunteer($volunteerRecordId)
    {
        $deleted = DB::delete('DELETE FROM aid_preparation_volunteers WHERE ID = ?', [$volunteerRecordId]);
        if ($deleted === 0) {
            throw new Exception('Volunteer record not found.');
        }
        return true;
    }

    /////////////////// Resource Usage CRUD ///////////////////

    public function createResourceUsage($preparationId, $resourceId, $quantityUsed)
    {
        DB::insert(
            'INSERT INTO aid_preparation_resources (PreparationID, ResourceID, QuantityUsed, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
            [$preparationId, $resourceId, $quantityUsed]
        );
        $id = DB::getPdo()->lastInsertId();
        $resourceUsage = DB::select('SELECT * FROM aid_preparation_resources WHERE ID = ? LIMIT 1', [$id]);
        return $resourceUsage[0];
    }
    
    public function getResourceUsages($preparationId)
    {
        return DB::select('SELECT * FROM aid_preparation_resources WHERE PreparationID = ?', [$preparationId]);
    }

    public function updateResourceUsage($usageRecordId, $resourceId, $quantityUsed)
    {
        $updated = DB::update(
            'UPDATE aid_preparation_resources SET ResourceID = ?, QuantityUsed = ?, updated_at = NOW() WHERE ID = ?',
            [$resourceId, $quantityUsed, $usageRecordId]
        );
        if ($updated === 0) {
            throw new Exception('Resource usage record not found.');
        }
        return true;
    }

    public function deleteResourceUsage($usageRecordId)
    {
        $deleted = DB::delete('DELETE FROM aid_preparation_resources WHERE ID = ?', [$usageRecordId]);
        if ($deleted === 0) {
            throw new Exception('Resource usage record not found.');
        }
        return true;
    }

    public function updateAidPrepStatus($preparationId, $status)
    {
        DB::update(
            'UPDATE aid_preparation SET Status = ?, updated_at = NOW() WHERE PreparationID = ?',
            [$status, $preparationId]
        );
    }
}
