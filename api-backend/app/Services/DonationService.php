<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class DonationService
{
    /**
     * Create a donation and manually update the resource.
     */
    public function createDonation($data)
    {
        return DB::transaction(function () use ($data) {
            // Convert ISO 8601 date to MySQL compatible datetime format
            $dateReceived = Carbon::parse($data['DateReceived'])->toDateTimeString();
            $now = Carbon::now()->toDateTimeString();

            // Insert a new donation using a raw SQL query including timestamp fields.
            DB::insert(
                "INSERT INTO donations (DonorName, DonationType, Quantity, DateReceived, AssociatedCenter, UserID, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    $data['DonorName'],
                    $data['DonationType'],  // e.g. food, water, clothes, money
                    $data['Quantity'],
                    $dateReceived,
                    $data['AssociatedCenter'],
                    $data['UserID'],
                    $now,
                    $now,
                ]
            );

            // Retrieve the last inserted donation ID.
            $donationId = DB::getPdo()->lastInsertId();

            // Update or create the corresponding resource.
            // $this->updateResourceFromDonation(
            //     $data['AssociatedCenter'],
            //     $data['DonationType'],
            //     $data['Quantity']
            // );

            // Return the newly created donation record.
            $donation = DB::select("SELECT * FROM donations WHERE DonationID = ?", [$donationId]);
            return $donation[0] ?? null;
        });
    }

    /**
     * Update or create a resource based on the donation using pure SQL.
     */
    // public function updateResourceFromDonation($reliefCenterId, $donationType, $quantity)
    // {
    //     // Check if a resource exists for the given relief center and donation type.
    //     $resource = DB::select(
    //         "SELECT * FROM resources WHERE ReliefCenterID = ? AND ResourceType = ? LIMIT 1",
    //         [$reliefCenterId, $donationType]
    //     );

    //     if ($resource) {
    //         // If the resource exists, increment its quantity.
    //         DB::update(
    //             "UPDATE resources SET Quantity = Quantity + ? WHERE ReliefCenterID = ? AND ResourceType = ?",
    //             [$quantity, $reliefCenterId, $donationType]
    //         );
    //     } else {
    //         // If not, create a new resource with an expiration date 6 months from now.
    //         $expirationDate = Carbon::now()->addMonths(6)->toDateTimeString();
    //         $now = Carbon::now()->toDateTimeString();
    //         DB::insert(
    //             "INSERT INTO resources (ResourceType, Quantity, ExpirationDate, ReliefCenterID, created_at, updated_at)
    //              VALUES (?, ?, ?, ?, ?, ?)",
    //             [$donationType, $quantity, $expirationDate, $reliefCenterId, $now, $now]
    //         );
    //     }
    // }

    /**
     * Get all donations made by a specific user.
     */
    public function getUserDonations($userId)
    {
        return DB::select("SELECT * FROM donations WHERE UserID = ?", [$userId]);
    }

    /**
     * Get all donations for admin view.
     */
    public function getAllDonations()
    {
        return DB::select("SELECT * FROM donations");
    }
}
