<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AidPrepService;

class AidPrepController extends Controller
{
    protected $aidPrepService;
    
    public function __construct(AidPrepService $aidPrepService)
    {
        $this->aidPrepService = $aidPrepService;
    }
    
    /**
     * Create a new aid preparation record.
     * This function checks that no aid prep exists for the given RequestID.
     * DepartureTime and EstimatedArrival are set to a placeholder value.
     */
    public function create(Request $request)
    {
        $request->validate([
            'RequestID' => 'required|integer'
        ]);
        
        try {
            $aidPrep = $this->aidPrepService->createAidPreparation($request->input('RequestID'));
            return response()->json(['success' => true, 'data' => $aidPrep], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }
    public function getAllAidPrepDetails()
{
    try {
        $details = $this->aidPrepService->getFullAidPrepDetails();
        return response()->json(['success' => true, 'data' => $details]);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
    }
}

    
    /**
     * Update DepartureTime and EstimatedArrival for a given aid preparation.
     */
    public function updateTimes(Request $request, $preparationId)
    {
        $request->validate([
            'DepartureTime'    => 'required|date',
            'EstimatedArrival' => 'required|date',
        ]);
        
        try {
            $this->aidPrepService->updateAidPreparationTimes(
                $preparationId,
                $request->input('DepartureTime'),
                $request->input('EstimatedArrival')
            );
            return response()->json(['success' => true, 'message' => 'Times updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }
    
    ///////////////// Volunteers CRUD ///////////////////
    
    /**
     * Add a volunteer to an aid preparation.
     */
    public function addVolunteer(Request $request, $preparationId)
    {
        // Log the preparation ID and request payload
        // error_log("Prep ID: " . $preparationId);
        // error_log("Request Data: " . json_encode($request->all()));
    
        $request->validate([
            'VolunteerID' => 'required|integer'
        ]);
        
        try {
            $volunteer = $this->aidPrepService->createVolunteer($preparationId, $request->input('VolunteerID'));
            return response()->json(['success' => true, 'data' => $volunteer], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }
    
    
    /**
     * List volunteers for a given aid preparation.
     */
    public function getVolunteers($requestId)
    {
        try {
            $volunteers = $this->aidPrepService->getVolunteers($requestId);
            return response()->json(['success' => true, 'data' => $volunteers]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }
    public function getAidPrepStatus($requestId)
    {
        try {
            $volunteers = $this->aidPrepService->getAidPrepStatus($requestId);
            return response()->json(['success' => true, 'data' => $volunteers]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }
    
    /**
     * Update a volunteer record.
     */
    public function updateVolunteer(Request $request, $volunteerRecordId)
    {
        $request->validate([
            'VolunteerID' => 'required|integer'
        ]);
        
        try {
            $this->aidPrepService->updateVolunteer($volunteerRecordId, $request->input('VolunteerID'));
            return response()->json(['success' => true, 'message' => 'Volunteer updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }
    
    /**
     * Delete a volunteer record.
     */
    public function deleteVolunteer($volunteerRecordId)
    {
        try {
            $this->aidPrepService->deleteVolunteer($volunteerRecordId);
            return response()->json(['success' => true, 'message' => 'Volunteer deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }
    
    ///////////////// Resources CRUD ///////////////////
    
    /**
     * Add a resource usage record to an aid preparation.
     */
    public function addResource(Request $request, $preparationId)
    {
        $request->validate([
            'ResourceID'   => 'required|integer',
            'QuantityUsed' => 'required|integer|min:1'
        ]);
        
        try {
            $resourceUsage = $this->aidPrepService->createResourceUsage(
                $preparationId,
                $request->input('ResourceID'),
                $request->input('QuantityUsed')
            );
            return response()->json(['success' => true, 'data' => $resourceUsage], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }
    
    /**
     * List resource usage records for a given aid preparation.
     */
    public function getResources($preparationId)
    {
        try {
            $resources = $this->aidPrepService->getResourceUsages($preparationId);
            return response()->json(['success' => true, 'data' => $resources]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }
    
    /**
     * Update a resource usage record.
     */
    public function updateResource(Request $request, $usageRecordId)
    {
        $request->validate([
            'ResourceID'   => 'required|integer',
            'QuantityUsed' => 'required|integer|min:1'
        ]);
        
        try {
            $this->aidPrepService->updateResourceUsage(
                $usageRecordId,
                $request->input('ResourceID'),
                $request->input('QuantityUsed')
            );
            return response()->json(['success' => true, 'message' => 'Resource usage updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }
    
    /**
     * Delete a resource usage record.
     */
    public function deleteResource($usageRecordId)
    {
        try {
            $this->aidPrepService->deleteResourceUsage($usageRecordId);
            return response()->json(['success' => true, 'message' => 'Resource usage deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    public function updateStatus(Request $request, $preparationId)
    {
        $request->validate([
            'Status' => 'required|string'
        ]);
        
        try {
            $this->aidPrepService->updateAidPrepStatus($preparationId, $request->input('Status'));
            return response()->json(['success' => true, 'message' => 'Status updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }
}
