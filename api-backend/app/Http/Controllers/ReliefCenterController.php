<?php

namespace App\Http\Controllers;

use App\Services\ReliefCenterService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ReliefCenterController extends Controller
{
    protected $reliefCenterService;

    public function __construct(ReliefCenterService $reliefCenterService)
    {
        $this->reliefCenterService = $reliefCenterService;
    }

    // Create a new relief center.
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'CenterName'                 => 'required|string|max:255',
            'Location'                   => 'required|string|max:255',
            'NumberOfVolunteersWorking'  => 'required|integer|min:0',
            'MaxVolunteersCapacity'      => 'required|integer|min:1',
            'ManagerID'                  => 'required|exists:users,UserID',
        ]);

        try {
            $reliefCenter = $this->reliefCenterService->createReliefCenter($validatedData);
            return response()->json($reliefCenter, Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create relief center: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Update an existing relief center.
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'CenterName'                => 'sometimes|required|string|max:255',
            'Location'                  => 'sometimes|required|string|max:255',
            'NumberOfVolunteersWorking' => 'sometimes|required|integer|min:0',
            'MaxVolunteersCapacity'     => 'sometimes|required|integer|min:1',
            'ManagerID'                 => 'sometimes|required|exists:users,UserID',
        ]);

        try {
            $reliefCenter = $this->reliefCenterService->updateReliefCenter($id, $validatedData);
            return response()->json($reliefCenter, Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update relief center: ' . $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    // Delete a relief center.
    public function destroy($id)
    {
        try {
            $this->reliefCenterService->deleteReliefCenter($id);
            return response()->json(['message' => 'Relief center deleted successfully'], Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete relief center: ' . $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    // Show a single relief center.
    public function show($id)
    {
        try {
            $reliefCenter = $this->reliefCenterService->getReliefCenterById($id);
            return response()->json($reliefCenter, Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Relief center not found: ' . $e->getMessage()
            ], Response::HTTP_NOT_FOUND);
        }
    }

    // List all relief centers.
    public function index()
    {
        try {
            $reliefCenters = $this->reliefCenterService->getAllReliefCenters();
            return response()->json($reliefCenters, Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error retrieving relief centers: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
