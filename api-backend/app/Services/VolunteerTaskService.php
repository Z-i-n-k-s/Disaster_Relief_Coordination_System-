<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class VolunteerTaskService
{
    /**
     * Retrieve aid preparation tasks that the volunteer participated in,
     * along with the associated request information.
     *
     * @param  int  $volunteerId
     * @return array
     */
    public function getAidPreparationTasks($volunteerId)
    {
        $sql = "
            SELECT 
                ap.PreparationID AS task_id, 
                ap.DepartureTime AS departure_time, 
                ap.EstimatedArrival AS estimated_arrival, 
                ap.Status AS task_status, 
                ap.created_at AS task_created_at,
                -- Request details
                ar.RequestType,
                ar.Description,
                ar.UrgencyLevel
            FROM aid_preparation_volunteers AS apv
            JOIN aid_preparation AS ap 
              ON apv.PreparationID = ap.PreparationID
            JOIN aid_requests AS ar
              ON ap.RequestID = ar.RequestID
            WHERE apv.VolunteerID = ?
        ";

        return DB::select($sql, [$volunteerId]);
    }

    /**
     * Retrieve rescue tracking tasks that the volunteer participated in.
     *
     * @param  int  $volunteerId
     * @return array
     */
    public function getRescueTrackingTasks($volunteerId)
    {
        $sql = "
            SELECT 
                rt.TrackingID AS task_id, 
                rt.RequestID AS req_id,
                rt.TrackingStatus AS status, 
                rt.OperationStartTime AS operation_start_time, 
                rt.CompletionTime AS completion_time, 
                rt.NumberOfPeopleHelped AS number_of_people_helped,
                ar.RequestID,
                ar.RequesterName,
                ar.ContactInfo,
                ar.RequestType,
                ar.Description,
                ar.UrgencyLevel,
                ar.Status AS request_status,
                ar.NumberOfPeople,
                ar.RequestDate,
                ar.ResponseTime,
                aa.AreaName AS area_name
            FROM rescue_tracking_volunteers AS rtv
            JOIN rescue_tracking AS rt 
              ON rtv.TrackingID = rt.TrackingID
            JOIN aid_requests AS ar
              ON rt.RequestID = ar.RequestID
            JOIN affected_areas AS aa
              ON ar.AreaID = aa.AreaID
            WHERE rtv.VolunteerID = ?
        ";
    
        return DB::select($sql, [$volunteerId]);
    }
    
}
