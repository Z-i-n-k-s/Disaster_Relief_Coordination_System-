<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ReliefCenterService
{
    /**
     * Create a new relief center.
     */
    public function createReliefCenter($data)
    {
        return DB::transaction(function () use ($data) {
            $columns = array_keys($data);
            $values  = array_values($data);
            $placeholders = implode(', ', array_fill(0, count($columns), '?'));
            $columnsStr   = implode(', ', $columns);

            DB::insert("INSERT INTO relief_centers ($columnsStr) VALUES ($placeholders)", $values);
            $id = DB::getPdo()->lastInsertId();

            return $this->getReliefCenterById($id);
        });
    }

    /**
     * Update an existing relief center.
     */
    public function updateReliefCenter($id, $data)
    {
        return DB::transaction(function () use ($id, $data) {
            // Ensure the record exists first
            $this->getReliefCenterById($id);

            $columns = array_keys($data);
            $values  = array_values($data);
            $setClause = implode(', ', array_map(fn($col) => "$col = ?", $columns));

            DB::update(
                "UPDATE relief_centers SET $setClause WHERE CenterID = ?",
                array_merge($values, [$id])
            );

            return $this->getReliefCenterById($id);
        });
    }

    /**
     * Delete a relief center.
     */
    public function deleteReliefCenter($id)
    {
        return DB::transaction(function () use ($id) {
            // Ensure the record exists
            $this->getReliefCenterById($id);
            DB::delete("DELETE FROM relief_centers WHERE CenterID = ?", [$id]);
            return true;
        });
    }

    /**
     * Retrieve a single relief center by ID, plus some related counts.
     */
    public function getReliefCenterById($id)
    {
        $result = DB::select("SELECT * FROM relief_centers WHERE CenterID = ? LIMIT 1", [$id]);
        if (empty($result)) {
            throw new ModelNotFoundException("ReliefCenter not found");
        }

        $center = $result[0];
        // Append volunteer, donation, and resource counts
        $volCount = DB::selectOne("SELECT COUNT(*) AS count FROM volunteers WHERE AssignedCenter = ?", [$center->CenterID]);
        $donCount = DB::selectOne("SELECT COUNT(*) AS count FROM donations WHERE AssociatedCenter = ?", [$center->CenterID]);
        $resCount = DB::selectOne("SELECT COUNT(*) AS count FROM resources WHERE ReliefCenterID = ?", [$center->CenterID]);

        $center->volunteersCount = $volCount->count;
        $center->donationsCount  = $donCount->count;
        $center->resourcesCount  = $resCount->count;

        return $center;
    }

    /**
     * Retrieve all relief centers, each with subquery counts.
     */
    public function getAllReliefCenters()
    {
        $sql = "
            SELECT rc.*,
                (SELECT COUNT(*) FROM volunteers v WHERE v.AssignedCenter = rc.CenterID) AS volunteersCount,
                (SELECT COUNT(*) FROM donations d WHERE d.AssociatedCenter = rc.CenterID) AS donationsCount,
                (SELECT COUNT(*) FROM resources r WHERE r.ReliefCenterID = rc.CenterID) AS resourcesCount
            FROM relief_centers rc
        ";
    
        $reliefCenters = DB::select($sql);
    
        foreach ($reliefCenters as &$center) {
            // manager
            $manager = DB::select("SELECT * FROM users WHERE UserID = ? LIMIT 1", [$center->ManagerID]);
            $center->manager = !empty($manager) ? $manager[0] : null;
    
            // resources
            $center->resources = DB::select("SELECT * FROM resources WHERE ReliefCenterID = ?", [$center->CenterID]);
    
            // volunteers
            $center->volunteers = DB::select("SELECT * FROM volunteers WHERE AssignedCenter = ?", [$center->CenterID]);
    
            // donations
            $center->donations = DB::select("SELECT * FROM donations WHERE AssociatedCenter = ?", [$center->CenterID]);
        }
    
        return $reliefCenters;
    }
    
}
