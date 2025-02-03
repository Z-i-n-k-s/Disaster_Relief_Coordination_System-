<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Volunteer extends Model
{
    use HasFactory;

    protected $primaryKey = 'VolunteerID';

    protected $fillable = [
        'Name',
        'ContactInfo',
        'AssignedCenter',
        'Status',
        'UserID',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'UserID', 'UserID');
    }

    public function reliefCenter(): BelongsTo
    {
        return $this->belongsTo(ReliefCenter::class, 'AssignedCenter', 'CenterID');
    }
}
