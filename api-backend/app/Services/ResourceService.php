<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Carbon;

class ResourceService
{
    /**
     * Create a new resource.
     */
    public function createResource($data)
    {
        return DB::transaction(function () use ($data) {
            $columns = array_keys($data);
            $values  = array_values($data);
            $placeholders = implode(', ', array_fill(0, count($data), '?'));
            $columnsStr   = implode(', ', $columns);

            DB::insert("INSERT INTO resources ($columnsStr) VALUES ($placeholders)", $values);
            $id = DB::getPdo()->lastInsertId();

            return $this->getResourceById($id);
        });
    }

    /**
     * Update an existing resource.
     */
    public function updateResource($id, $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $this->getResourceById($id);

            $columns = array_keys($data);
            $values  = array_values($data);
            $setClause = implode(', ', array_map(fn($col) => "$col = ?", $columns));

            DB::update(
                "UPDATE resources SET $setClause WHERE ResourceID = ?",
                array_merge($values, [$id])
            );

            return $this->getResourceById($id);
        });
    }

    /**
     * Delete a resource.
     */
    public function deleteResource($id)
    {
        return DB::transaction(function () use ($id) {
            $this->getResourceById($id);
            DB::delete("DELETE FROM resources WHERE ResourceID = ?", [$id]);
            return true;
        });
    }

    /**
     * Retrieve a single resource by ID.
     */
    public function getResourceById($id)
    {
        $result = DB::select("SELECT * FROM resources WHERE ResourceID = ? LIMIT 1", [$id]);
        if (empty($result)) {
            throw new ModelNotFoundException("Resource not found.");
        }
        return $result[0];
    }

    /**
     * Retrieve all resources.
     */
    public function getAllResources()
    {
        return DB::select("SELECT * FROM resources");
    }

    /**
     * Update or insert a resource based on a donation (if no trigger is used).
     */
    public function updateResourceFromDonation($donation)
    {
        $expirationDate = Carbon::parse($donation->DateReceived)->addMonths(6)->toDateTimeString();
        DB::insert(
            "INSERT INTO resources (ResourceType, Quantity, ExpirationDate, ReliefCenterID)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE Quantity = Quantity + VALUES(Quantity)",
            [
                $donation->DonationType,
                $donation->Quantity,
                $expirationDate,
                $donation->AssociatedCenter
            ]
        );

        // Return the updated or newly created resource
        $sql = "SELECT * FROM resources WHERE ResourceType = ? AND ReliefCenterID = ? LIMIT 1";
        $resource = DB::select($sql, [$donation->DonationType, $donation->AssociatedCenter]);
        return $resource[0] ?? null;
    }

    /**
     * Deduct a resource quantity for an AidPreparation record.
     */
    public function deductResourceForAidPreparation($aidPreparation)
    {
        return DB::transaction(function () use ($aidPreparation) {
            $resource = $this->getResourceById($aidPreparation->ResourceID);
            if ($resource->Quantity < $aidPreparation->QuantityUsed) {
                throw new \Exception("Not enough resources available.");
            }

            $newQuantity = $resource->Quantity - $aidPreparation->QuantityUsed;
            DB::update("UPDATE resources SET Quantity = ? WHERE ResourceID = ?", [$newQuantity, $aidPreparation->ResourceID]);

            return $this->getResourceById($aidPreparation->ResourceID);
        });
    }
}
