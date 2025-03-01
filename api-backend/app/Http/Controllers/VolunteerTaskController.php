<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\VolunteerTaskService;

class VolunteerTaskController extends Controller
{
    protected $volunteerTaskService;

    public function __construct(VolunteerTaskService $volunteerTaskService)
    {
        $this->volunteerTaskService = $volunteerTaskService;
    }

    /**
     * Get aid preparation tasks for a given volunteer.
     *
     * @param  Request  $request
     * @param  int      $volunteerId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAidPrepTasks(Request $request, $volunteerId)
    {
        $tasks = $this->volunteerTaskService->getAidPreparationTasks($volunteerId);
        return response()->json(['data' => $tasks]);
    }

    /**
     * Get rescue tracking tasks for a given volunteer.
     *
     * @param  Request  $request
     * @param  int      $volunteerId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRescueTrackingTasks(Request $request, $volunteerId)
    {
        $tasks = $this->volunteerTaskService->getRescueTrackingTasks($volunteerId);
        return response()->json(['data' => $tasks]);
    }
}
