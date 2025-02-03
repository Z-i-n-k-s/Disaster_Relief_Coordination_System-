<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RescueTrackingVolunteer extends Model
{
    use HasFactory;

    protected $fillable = [
        'TrackingID',
        'VolunteerID',
    ];

    public function rescueTracking()
    {
        return $this->belongsTo(RescueTracking::class, 'TrackingID');
    }

    public function volunteer()
    {
        return $this->belongsTo(Volunteer::class, 'VolunteerID');
    }
}
