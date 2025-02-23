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

    // Get a single aid request by ID
    public function getById($id)
    {
        $sql = "SELECT * FROM aid_requests WHERE id = ?";
        $result = DB::select($sql, [$id]);
        return count($result) ? $result[0] : null;
    }

    // Create a new aid request with transaction and subquery
    public function create($data)
    {
        DB::beginTransaction();
        try {
            // Insert the new aid request using raw SQL.
            // Note: Assumes that your table column names match your model fillable properties.
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
                $data['Status'],
                $data['NumberOfPeople'],
                $data['RequestDate'],
                $data['ResponseTime']
            ]);

            // Retrieve the last inserted ID
            $newId = DB::getPdo()->lastInsertId();

            // Example of a subquery: fetch the most recent request for this user (could be useful for logging)
            $subQuerySql = "SELECT * FROM aid_requests 
                            WHERE id = (SELECT MAX(id) FROM aid_requests WHERE UserID = ?)";
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
            $sql = "UPDATE aid_requests SET $setStr WHERE id = ?";
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
            $sql = "DELETE FROM aid_requests WHERE id = ?";
            $affected = DB::delete($sql, [$id]);
            DB::commit();
            return $affected;
        } catch(Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    // Example method to create a trigger (typically done via migrations)
    public function createTrigger()
    {
        $triggerSql = "
            CREATE TRIGGER update_response_time 
            AFTER INSERT ON aid_requests
            FOR EACH ROW
            BEGIN
                UPDATE aid_requests SET ResponseTime = NOW() WHERE id = NEW.id;
            END
        ";
        // Execute the trigger creation. Note: This may need to be run with proper privileges.
        DB::unprepared($triggerSql);
    }
}
