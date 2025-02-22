<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class DonationService
{
    /**
     * Create a donation and (optionally) update resources via trigger or manual call.
     */
    public function createDonation($data)
    {
        return DB::transaction(function () use ($data) {
            // Convert ISO 8601 date to MySQL compatible datetime format
            $dateReceived = Carbon::parse($data['DateReceived'])->toDateTimeString();

            DB::insert(
                "INSERT INTO donations (DonorName, DonationType, Quantity, DateReceived, AssociatedCenter, UserID)
             VALUES (?, ?, ?, ?, ?, ?)",
                [
                    $data['DonorName'],
                    $data['DonationType'],  // e.g. Food, Money, Clothes
                    $data['Quantity'],
                    $dateReceived,
                    $data['AssociatedCenter'], // references relief_centers.CenterID
                    $data['UserID']
                ]
            );

            $donationId = DB::getPdo()->lastInsertId();
            $donation = DB::select("SELECT * FROM donations WHERE DonationID = ?", [$donationId]);
            return $donation[0] ?? null;
        });
    }

    /**
     * Optional: Initialize a trigger to update resources automatically after a donation insert.
     * Typically, you'd define this in a migration.
     */
    public function initializeDonationTrigger()
    {
        $triggerSQL = "
        CREATE TRIGGER trg_after_donation_insert
        AFTER INSERT ON donations
        FOR EACH ROW
        BEGIN
            INSERT INTO resources (ResourceType, Quantity, ExpirationDate, ReliefCenterID)
            VALUES (NEW.DonationType, NEW.Quantity, DATE_ADD(NEW.DateReceived, INTERVAL 6 MONTH), NEW.AssociatedCenter)
            ON DUPLICATE KEY UPDATE Quantity = Quantity + NEW.Quantity;
        END";

        DB::unprepared($triggerSQL);
    }

    /**
     * Manually update a resource from a donation (if no trigger is used).
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
    }

    /**
     * Get all donations made by a specific user.
     */
    public function getUserDonations($userId)
    {
        return DB::select(
            "SELECT * FROM donations WHERE UserID = ?",
            [$userId]
        );
    }

    /**
     * Get all donations (admin view).
     */
    public function getAllDonations()
    {
        return DB::select("SELECT * FROM donations");
    }
}
