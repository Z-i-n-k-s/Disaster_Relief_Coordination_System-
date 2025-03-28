<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RescueTracking extends Model
{
    use HasFactory;

    protected $fillable = [
        'RequestID',
        'TrackingStatus',
        'CurrentLocation',
        'OperationStartTime',
        'NumberOfPeopleHelped',
        'SuppliesDelivered',
        'CompletionTime',
    ];

    protected $casts = [
        'TrackingStatus' => 'string',
        'OperationStartTime' => 'datetime',
        'CompletionTime' => 'datetime',
    ];

    public function aidRequest()
    {
        return $this->belongsTo(AidRequest::class, 'RequestID');
    }

    public function rescueTrackingVolunteers()
    {
        return $this->hasMany(RescueTrackingVolunteer::class, 'TrackingID');
    }
}
