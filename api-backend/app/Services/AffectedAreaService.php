<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Exception;

class AffectedAreaService
{
    // Retrieve all affected areas using raw SQL
    public function getAll()
    {
        $sql = "SELECT * FROM affected_areas";
        return DB::select($sql);
    }

    // Retrieve a single affected area by its ID
    public function getById($id)
    {
        $sql = "SELECT * FROM affected_areas WHERE id = ?";
        $result = DB::select($sql, [$id]);
        return count($result) ? $result[0] : null;
    }

    // Create a new affected area with transaction and a subquery example
    public function create($data)
    {
        DB::beginTransaction();
        try {
            $sql = "INSERT INTO affected_areas (AreaName, AreaType, SeverityLevel, Population)
                    VALUES (?, ?, ?, ?)";
            DB::insert($sql, [
                $data['AreaName'],
                $data['AreaType'],
                $data['SeverityLevel'],
                $data['Population']
            ]);

            // Retrieve the last inserted ID
            $newId = DB::getPdo()->lastInsertId();

            // Example subquery: fetch the affected area with the highest id for the given AreaType
            $subQuerySql = "SELECT * FROM affected_areas 
                            WHERE id = (SELECT MAX(id) FROM affected_areas WHERE AreaType = ?)";
            $result = DB::select($subQuerySql, [$data['AreaType']]);

            DB::commit();
            return count($result) ? $result[0] : null;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    // Update an affected area using raw SQL and transactions
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
            $sql = "UPDATE affected_areas SET $setStr WHERE id = ?";
            $affected = DB::update($sql, $bindings);
            DB::commit();
            return $affected;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    // Delete an affected area using raw SQL and transactions
    public function delete($id)
    {
        DB::beginTransaction();
        try {
            $sql = "DELETE FROM affected_areas WHERE id = ?";
            $affected = DB::delete($sql, [$id]);
            DB::commit();
            return $affected;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    // Example method to create a trigger (typically done via migrations)
    public function createTrigger()
    {
        $triggerSql = "
            CREATE TRIGGER set_default_population
            BEFORE INSERT ON affected_areas
            FOR EACH ROW
            BEGIN
                IF NEW.Population IS NULL THEN
                    SET NEW.Population = 0;
                END IF;
            END
        ";
        DB::unprepared($triggerSql);
    }
}
