<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    use HasFactory;
    protected $primaryKey = 'ResourceID';

    protected $fillable = [
        'ResourceType',
        'Quantity',
        'ExpirationDate',
        'ReliefCenterID',
    ];

    public function reliefCenter()
    {
        return $this->belongsTo(ReliefCenter::class, 'ReliefCenterID');
    }

    public function donations()
    {
        return $this->hasMany(Donation::class, 'ResourceID');
    }

    public function aidPreparations()
    {
        return $this->hasMany(AidPreparation::class, 'ResourceID');
    }
}

