<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AffectedArea extends Model
{
    use HasFactory;

    protected $fillable = [
        'AreaName',
        'AreaType',
        'SeverityLevel',
        'Population',
    ];

    protected $casts = [
        'AreaType' => 'string',
        'SeverityLevel' => 'string',
    ];

    public function aidRequests()
    {
        return $this->hasMany(AidRequest::class, 'AreaID');
    }
}

