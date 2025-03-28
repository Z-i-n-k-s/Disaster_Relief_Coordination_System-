<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AidPreparation extends Model
{
    use HasFactory;

    protected $fillable = [
        'RequestID',
        'DepartureTime',
        'EstimatedArrival',
        'Status',
    ];

    protected $casts = [
        'DepartureTime'    => 'datetime',
        'EstimatedArrival' => 'datetime',
    ];

    public function aidRequest()
    {
        return $this->belongsTo(AidRequest::class, 'RequestID');
    }

    // New relationship: each AidPreparation can have many associated resources used.
    public function resources()
    {
        return $this->hasMany(AidPreparationResource::class, 'PreparationID');
    }

    // New relationship: each AidPreparation can have many associated volunteers.
    public function volunteers()
    {
        return $this->hasMany(AidPreparationVolunteer::class, 'PreparationID');
    }
}
