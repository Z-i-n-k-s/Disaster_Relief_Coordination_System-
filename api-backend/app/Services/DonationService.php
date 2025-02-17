<?php

namespace App\Services;

use App\Models\Donation;
use App\Models\Resource;
use Illuminate\Support\Facades\DB;

class DonationService
{
    // Function to handle donation creation and resource update
    public function createDonation($data)
    {
        return DB::transaction(function () use ($data) {
            // Create a new donation
            $donation = Donation::create([
                'DonorName'         => $data['DonorName'],
                'DonationType'      => $data['DonationType'], // Enum: food, water, clothes, money
                'Quantity'          => $data['Quantity'],
                'DateReceived'      => $data['DateReceived'],
                'AssociatedCenter'  => $data['AssociatedCenter'],
                'UserID'            => $data['UserID'],
            ]);

            // Update or create resource
            $this->updateResourceFromDonation(
                $data['AssociatedCenter'],
                $data['DonationType'],
                $data['Quantity']
            );

            return $donation;
        });
    }

    // Function to update resources based on donations
    public function updateResourceFromDonation($reliefCenterId, $donationType, $quantity)
{
    $resource = Resource::where('ReliefCenterID', $reliefCenterId)
                        ->where('ResourceType', $donationType)
                        ->first();

    if ($resource) {
        $resource->increment('Quantity', $quantity);
    } else {
        Resource::create([
            'ResourceType'   => $donationType,
            'Quantity'       => $quantity,
            'ExpirationDate' => now()->addMonths(6),
            'ReliefCenterID' => $reliefCenterId,
        ]);
    }
}


    // Function to get all donations made by a specific user
    public function getUserDonations($userId)
    {
        return Donation::where('UserID', $userId)->get();
    }

    // Function to get all donations for admin view
    public function getAllDonations()
    {
        return Donation::all();
    }
}
