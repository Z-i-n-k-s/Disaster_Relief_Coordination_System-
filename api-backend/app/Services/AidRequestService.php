<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Exception;

class AidRequestService
{
    // Get all aid requests using raw SQL
    public function getAll()
    {
        $sql = "SELECT * FROM aid_requests";
        return DB::select($sql);
    }

    // Get all aid requests for a single user by UserID
    public function getByUser($userId)
    {
        $sql = "SELECT * FROM aid_requests WHERE UserID = ?";
        return DB::select($sql, [$userId]);
    }

    // Get a single aid request by RequestID
    public function getById($id)
    {
        $sql = "SELECT * FROM aid_requests WHERE RequestID = ?";
        $result = DB::select($sql, [$id]);
        return count($result) ? $result[0] : null;
    }

    // Create a new aid request with transaction and subquery
    public function create($data)
    {
        DB::beginTransaction();
        try {
            // Insert the new aid request.
            // Assumes that the table columns match the keys in $data.
            $sql = "INSERT INTO aid_requests 
                        (UserID, AreaID, RequesterName, ContactInfo, RequestType, Description, UrgencyLevel, Status, NumberOfPeople, RequestDate, ResponseTime)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            DB::insert($sql, [
                $data['UserID'], 
                $data['AreaID'],
                $data['RequesterName'],
                $data['ContactInfo'],
                $data['RequestType'],
                $data['Description'],
                $data['UrgencyLevel'],
                $data['Status'],          // This should be set to 'Pending' by default.
                $data['NumberOfPeople'],
                $data['RequestDate'],
                $data['ResponseTime']
            ]);

            // Retrieve the last inserted RequestID
            $newId = DB::getPdo()->lastInsertId();

            // Example subquery: fetch the most recent request for this user (could be used for logging)
            $subQuerySql = "SELECT * FROM aid_requests 
                            WHERE RequestID = (SELECT MAX(RequestID) FROM aid_requests WHERE UserID = ?)";
            $result = DB::select($subQuerySql, [$data['UserID']]);

            DB::commit();
            return count($result) ? $result[0] : null;
        } catch(Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    // Update an aid request using raw SQL and transactions
    public function update($id, $data)
    {
        DB::beginTransaction();
        try {
            $set = [];
            $bindings = [];
            foreach ($data as $column => $value) {
                $set[] = "$column = ?";
                $bindings[] = $value;
            }
            $bindings[] = $id;
            $setStr = implode(', ', $set);
            $sql = "UPDATE aid_requests SET $setStr WHERE RequestID = ?";
            $affected = DB::update($sql, $bindings);
            DB::commit();
            return $affected;
        } catch(Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    // Delete an aid request using raw SQL and transactions
    public function delete($id)
    {
        DB::beginTransaction();
        try {
            $sql = "DELETE FROM aid_requests WHERE RequestID = ?";
            $affected = DB::delete($sql, [$id]);
            DB::commit();
            return $affected;
        } catch(Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    // Update only the status of an aid request using raw SQL and transactions
public function updateStatus($id, $status)
{
   
    // Define allowed status values.
    $validStatuses = ['Pending', 'In Progress', 'Completed'];
    if (!in_array($status, $validStatuses)) {
        throw new Exception("Invalid status: $status");
    }

    DB::beginTransaction();
    try {
        $sql = "UPDATE aid_requests SET Status = ? WHERE RequestID = ?";
        $affected = DB::update($sql, [$status, $id]);
        DB::commit();
        return $affected;
    } catch(Exception $e) {
        DB::rollBack();
        throw $e;
    }
}

    
}
