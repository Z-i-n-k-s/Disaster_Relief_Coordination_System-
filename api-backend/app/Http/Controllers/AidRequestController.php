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

    // Get all aid requests for a specific user
    public function getUserRequests($userId)
    {
        try {
            $aidRequests = $this->aidRequestService->getByUser($userId);
            return response()->json($aidRequests, 200);
        } catch(Exception $e) {
            return response()->json(['error' => 'Error fetching aid requests for the user'], 500);
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
            error_log($e);
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
    public function updateStatus(Request $request, $id)
    {
        // Validate that the provided status is one of the allowed values.
        $request->validate([
            'status' => 'required|string|in:Pending,In Progress,Completed',
        ]);
        
        try {
            // Retrieve the validated status value.
            $newStatus = $request->input('status');
            
            // Call the service method to update the status.
            $affected = $this->aidRequestService->updateStatus($id, $newStatus);
            return response()->json([
                'message' => 'Status updated successfully',
                'affected' => $affected,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
}
