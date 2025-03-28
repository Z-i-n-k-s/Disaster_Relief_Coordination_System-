<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\RescueTrackingVolunteerService;

class RescueTrackingVolunteerController extends Controller
{
    protected $volunteerService;

    public function __construct(RescueTrackingVolunteerService $volunteerService)
    {
        $this->volunteerService = $volunteerService;
    }

    /**
     * List all rescue tracking volunteers.
     */
    public function index()
    {
        $volunteers = $this->volunteerService->getAll();
        return response()->json($volunteers);
    }

    /**
     * Create a new RescueTrackingVolunteer record.
     *
     * Expected request data:
     * - TrackingID: must exist in rescue_tracking
     * - VolunteerID: must exist in volunteers
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'TrackingID'  => 'required|integer|exists:rescue_tracking,TrackingID',
            'VolunteerID' => 'required|integer|exists:volunteers,VolunteerID',
        ]);
    
        // Extract values individually
        $trackingId = $validated['TrackingID'];
        $volunteerId = $validated['VolunteerID'];
    
        // Pass the values individually to the service
        $volunteer = $this->volunteerService->create($trackingId, $volunteerId);
        
        return response()->json($volunteer, 201);
    }
    
}
