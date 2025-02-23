<?php

namespace App\Http\Controllers;

use App\Services\AidRequestService;
use Illuminate\Http\Request;
use Exception;

class AidRequestController extends Controller
{
    protected $aidRequestService;

    public function __construct(AidRequestService $aidRequestService)
    {
        $this->aidRequestService = $aidRequestService;
    }

    // List all aid requests
    public function index()
    {
        try {
            $aidRequests = $this->aidRequestService->getAll();
            return response()->json($aidRequests, 200);
        } catch(Exception $e) {
            return response()->json(['error' => 'Error fetching aid requests'], 500);
        }
    }

    // Create a new aid request
    public function store(Request $request)
    {
        try {
            $data = $request->all();
            $aidRequest = $this->aidRequestService->create($data);
            return response()->json($aidRequest, 201);
        } catch(Exception $e) {
            return response()->json(['error' => 'Error creating aid request'], 500);
        }
    }

    // Retrieve a single aid request by ID
    public function show($id)
    {
        try {
            $aidRequest = $this->aidRequestService->getById($id);
            if (!$aidRequest) {
                return response()->json(['error' => 'Not found'], 404);
            }
            return response()->json($aidRequest, 200);
        } catch(Exception $e) {
            return response()->json(['error' => 'Error fetching aid request'], 500);
        }
    }

    // Update an existing aid request
    public function update(Request $request, $id)
    {
        try {
            $data = $request->all();
            $updated = $this->aidRequestService->update($id, $data);
            if(!$updated) {
                return response()->json(['error' => 'Not found or update failed'], 404);
            }
            return response()->json(['message' => 'Aid request updated successfully'], 200);
        } catch(Exception $e) {
            return response()->json(['error' => 'Error updating aid request'], 500);
        }
    }

    // Delete an aid request
    public function destroy($id)
    {
        try {
            $deleted = $this->aidRequestService->delete($id);
            if (!$deleted) {
                return response()->json(['error' => 'Not found or delete failed'], 404);
            }
            return response()->json(['message' => 'Aid request deleted successfully'], 200);
        } catch(Exception $e) {
            return response()->json(['error' => 'Error deleting aid request'], 500);
        }
    }
}
