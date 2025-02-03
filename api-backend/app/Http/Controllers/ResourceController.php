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

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'ResourceType' => 'required|string|max:255',
            'Quantity' => 'required|integer|min:1',
            'ExpirationDate' => 'nullable|date',
            'ReliefCenterID' => 'required|exists:relief_centers,CenterID',
        ]);

        $resource = $this->resourceService->createResource($validatedData);
        return response()->json($resource, Response::HTTP_CREATED);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'ResourceType' => 'sometimes|required|string|max:255',
            'Quantity' => 'sometimes|required|integer|min:0',
            'ExpirationDate' => 'nullable|date',
            'ReliefCenterID' => 'sometimes|required|exists:relief_centers,CenterID',
        ]);

        $resource = $this->resourceService->updateResource($id, $validatedData);
        return response()->json($resource, Response::HTTP_OK);
    }

    public function destroy($id)
    {
        $this->resourceService->deleteResource($id);
        return response()->json(['message' => 'Resource deleted successfully'], Response::HTTP_NO_CONTENT);
    }

    public function show($id)
    {
        $resource = $this->resourceService->getResourceById($id);
        return response()->json($resource, Response::HTTP_OK);
    }

    public function index()
    {
        $resources = $this->resourceService->getAllResources();
        return response()->json($resources, Response::HTTP_OK);
    }

    public function handleDonation(Donation $donation)
    {
        $updatedResource = $this->resourceService->updateResourceFromDonation($donation);
        return response()->json($updatedResource, Response::HTTP_OK);
    }

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
