<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AidRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'UserID',
        'AreaID',
        'RequesterName',
        'ContactInfo',
        'RequestType',
        'Description',
        'UrgencyLevel',
        'Status',
        'NumberOfPeople',
        'RequestDate',
        'ResponseTime',
    ];

    protected $casts = [
        'RequestType' => 'string',
        'UrgencyLevel' => 'string',
        'Status' => 'string',
        'RequestDate' => 'datetime',
        'ResponseTime' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'UserID');
    }

    public function affectedArea()
    {
        return $this->belongsTo(AffectedArea::class, 'AreaID');
    }

    public function aidPreparations()
    {
        return $this->hasMany(AidPreparation::class, 'RequestID');
    }

    public function rescueTrackings()
    {
        return $this->hasMany(RescueTracking::class, 'RequestID');
    }
}

