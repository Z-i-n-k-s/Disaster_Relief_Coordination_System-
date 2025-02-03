<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory;

    protected $fillable = [
        'DonorName',
        'DonationType',
        'Quantity',
        'DateReceived',
        'AssociatedCenter',
        'UserID',
        'ResourceID',
    ];

    protected $casts = [
        'DonationType' => 'string',
        'DateReceived' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'UserID');
    }

    public function reliefCenter()
    {
        return $this->belongsTo(ReliefCenter::class, 'AssociatedCenter');
    }

    public function resource()
    {
        return $this->belongsTo(Resource::class, 'ResourceID');
    }
}

