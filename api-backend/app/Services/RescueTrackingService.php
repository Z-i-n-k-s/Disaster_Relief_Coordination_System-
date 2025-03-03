<?php

namespace App\Services;


use Illuminate\Support\Facades\DB;

class RescueTrackingService
{
    public function createTracking(array $data)
    {
        // Check if a tracking record already exists for the given RequestID
        $existing = DB::selectOne("SELECT * FROM rescue_tracking WHERE RequestID = ?", [
            $data['request_id']
        ]);

        // If the record exists, return it immediately
        if ($existing) {
            return $existing;
        }

        // Insert a new tracking record if none exists
        $sql = "INSERT INTO rescue_tracking (RequestID, OperationStartTime, TrackingStatus, NumberOfPeopleHelped)
                VALUES (?, ?, 'In Progress', 0)";
        DB::insert($sql, [
            $data['request_id'],
            $data['departure_time']
        ]);

        // Get the ID of the newly inserted record
        $id = DB::getPdo()->lastInsertId();

        // Retrieve and return the new record by its TrackingID
        $sqlSelect = "SELECT * FROM rescue_tracking WHERE TrackingID = ?";
        return DB::selectOne($sqlSelect, [$id]);
    }
    public function updateTracking($id, array $data)
    {
        $sqlSelect = "SELECT * FROM rescue_tracking WHERE TrackingID = ?";
        $tracking = DB::selectOne($sqlSelect, [$id]);
        if (!$tracking) {
            return false;
        }

        $setParts = [];
        $bindings = [];
        foreach ($data as $column => $value) {
            $setParts[] = "$column = ?";
            $bindings[] = $value;
        }
        $bindings[] = $id;
        $setClause = implode(", ", $setParts);
        $sqlUpdate = "UPDATE rescue_tracking SET $setClause WHERE TrackingID = ?";
        DB::update($sqlUpdate, $bindings);

        return DB::selectOne($sqlSelect, [$id]);
    }

    public function getTracking($id)
    {
        $sql = "SELECT * FROM rescue_tracking WHERE TrackingID = ?";
        return DB::selectOne($sql, [$id]);
    }
    public function getAllTracking()
{
    $sql = "SELECT * FROM rescue_tracking";
    return DB::select($sql);
}
    
}
