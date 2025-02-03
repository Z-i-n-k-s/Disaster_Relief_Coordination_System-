<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AidPreparation extends Model
{
    use HasFactory;

    protected $fillable = [
        'RequestID',
        'PreparedBy',
        'DepartureTime',
        'EstimatedArrival',
        'ResourceID',
        'QuantityUsed',
    ];

    protected $casts = [
        'DepartureTime' => 'datetime',
        'EstimatedArrival' => 'datetime',
    ];

    public function aidRequest()
    {
        return $this->belongsTo(AidRequest::class, 'RequestID');
    }

    public function volunteer()
    {
        return $this->belongsTo(Volunteer::class, 'PreparedBy');
    }

    public function resource()
    {
        return $this->belongsTo(Resource::class, 'ResourceID');
    }
}

