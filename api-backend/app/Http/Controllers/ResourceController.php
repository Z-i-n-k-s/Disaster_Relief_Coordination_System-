<?php

namespace App\Http\Controllers;

use App\Services\ResourceService;
use App\Models\Donation;
use App\Models\AidPreparation;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ResourceController extends Controller
{
    protected $resourceService;

    public function __construct(ResourceService $resourceService)
    {
        $this->resourceService = $resourceService;
    }

    // Create a new resource.
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'ResourceType'  => 'required|string|max:255',
            'Quantity'      => 'required|integer|min:1',
            'ExpirationDate'=> 'nullable|date',
            'ReliefCenterID'=> 'required|exists:relief_centers,CenterID',
        ]);

        try {
            $resource = $this->resourceService->createResource($validatedData);
            return response()->json($resource, Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Resource creation failed: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Update an existing resource.
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'ResourceType'  => 'sometimes|required|string|max:255',
            'Quantity'      => 'sometimes|required|integer|min:0',
            'ExpirationDate'=> 'nullable|date',
            'ReliefCenterID'=> 'sometimes|required|exists:relief_centers,CenterID',
        ]);

        try {
            $resource = $this->resourceService->updateResource($id, $validatedData);
            return response()->json($resource, Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Resource update failed: ' . $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    // Delete a resource.
    public function destroy($id)
    {
        try {
            $this->resourceService->deleteResource($id);
            return response()->json(['message' => 'Resource deleted successfully'], Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete resource: ' . $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    // Show details of a single resource.
    public function show($id)
    {
        try {
            $resource = $this->resourceService->getResourceById($id);
            return response()->json($resource, Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Resource not found: ' . $e->getMessage()
            ], Response::HTTP_NOT_FOUND);
        }
    }

    // List all resources.
    public function index()
    {
        try {
            $resources = $this->resourceService->getAllResources();
            return response()->json($resources, Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error retrieving resources: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Update a resource based on a donation.
    public function handleDonation(Donation $donation)
    {
        try {
            $updatedResource = $this->resourceService->updateResourceFromDonation($donation);
            return response()->json($updatedResource, Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update resource from donation: ' . $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    // Deduct resource quantity for aid preparation.
    public function handleAidPreparation(AidPreparation $aidPreparation)
    {
        try {
            $updatedResource = $this->resourceService->deductResourceForAidPreparation($aidPreparation);
            return response()->json($updatedResource, Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
}
