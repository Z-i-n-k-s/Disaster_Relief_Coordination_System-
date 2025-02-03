<?php
namespace App\Services;

use App\Models\Donation;
use App\Models\Resource;
use App\Models\ReliefCenter;

class DonationService
{
    // Function to handle donation creation and resource update
    public function createDonation($data)
    {
        // Create a new donation
        $donation = Donation::create([
            'DonorName' => $data['DonorName'],
            'DonationType' => $data['DonationType'],
            'Quantity' => $data['Quantity'],
            'DateReceived' => $data['DateReceived'],
            'AssociatedCenter' => $data['AssociatedCenter'],
            'UserID' => $data['UserID'],
            'ResourceID' => $data['ResourceID'],
        ]);

        // Call the updateResourceFromDonation function to update the resources
        $this->updateResourceFromDonation($data['ResourceID'], $data['Quantity']);

        return $donation;
    }

    // Function to update resources based on donations
    public function updateResourceFromDonation($resourceId, $quantity)
    {
        // Find the resource
        $resource = Resource::find($resourceId);

        if ($resource) {
            // Update the resource quantity
            $resource->increment('Quantity', $quantity);

            // Find the associated relief center and update
            $reliefCenter = ReliefCenter::find($resource->ReliefCenterID);
            if ($reliefCenter) {
                $reliefCenter->increment('NumberOfVolunteersWorking');  // You can modify this line as needed.
            }
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
