<?php
namespace App\Services;

use App\Models\Resource;
use App\Models\Donation;
use App\Models\AidPreparation;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ResourceService
{
    public function createResource($data)
    {
        return Resource::create($data);
    }

    public function updateResource($id, $data)
    {
        $resource = Resource::findOrFail($id);
        $resource->update($data);
        return $resource;
    }

    public function deleteResource($id)
    {
        $resource = Resource::findOrFail($id);
        $resource->delete();
        return true;
    }

    public function getResourceById($id)
    {
        return Resource::findOrFail($id);
    }

    public function getAllResources()
    {
        return Resource::all();
    }

    public function updateResourceFromDonation(Donation $donation)
    {
        $resource = Resource::firstOrCreate(
            [
                'ResourceType' => $donation->DonationType,
                'ReliefCenterID' => $donation->AssociatedCenter,
            ],
            [
                'Quantity' => 0,
                'ExpirationDate' => null
            ]
        );

        $resource->Quantity += $donation->Quantity;
        $resource->save();

        return $resource;
    }

    public function deductResourceForAidPreparation(AidPreparation $aidPreparation)
    {
        $resource = Resource::findOrFail($aidPreparation->ResourceID);
        
        if ($resource->Quantity < $aidPreparation->QuantityUsed) {
            throw new \Exception("Not enough resources available.");
        }

        $resource->Quantity -= $aidPreparation->QuantityUsed;
        $resource->save();

        return $resource;
    }
}
