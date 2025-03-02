<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\RescueTrackingService;

class RescueTrackingController extends Controller
{
    protected $rescueTrackingService;

    public function __construct(RescueTrackingService $rescueTrackingService)
    {
        $this->rescueTrackingService = $rescueTrackingService;
    }

    /**
     * Create a new RescueTracking record.
     *
     * Expected request data:
     * - request_id (integer, must exist in aid_requests)
     * - departure_time (datetime)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'request_id'     => 'required|integer|exists:aid_requests,RequestID',
            'departure_time' => 'required|date',
        ]);

        $tracking = $this->rescueTrackingService->createTracking($validated);

        return response()->json($tracking, 201);
    }

    /**
     * Update an existing RescueTracking record.
     *
     * Allowed updates:
     * - TrackingStatus: 'In Progress' or 'Completed'
     * - NumberOfPeopleHelped: integer
     * - CompletionTime: datetime
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'TrackingStatus'      => 'sometimes|in:In Progress,Completed',
            'NumberOfPeopleHelped'=> 'sometimes|integer',
            'CompletionTime'      => 'sometimes|date',
        ]);

        $tracking = $this->rescueTrackingService->updateTracking($id, $validated);
        if (!$tracking) {
            return response()->json(['message' => 'Rescue tracking record not found.'], 404);
        }

        return response()->json($tracking, 200);
    }

    /**
     * Retrieve a specific RescueTracking record.
     */
    public function show($id)
    {
        $tracking = $this->rescueTrackingService->getTracking($id);
        if (!$tracking) {
            return response()->json(['message' => 'Rescue tracking record not found.'], 404);
        }
        return response()->json($tracking, 200);
    }
}
