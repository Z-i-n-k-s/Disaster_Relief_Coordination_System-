<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AidPreparationVolunteer extends Model
{
    use HasFactory;

    protected $fillable = [
        'PreparationID',
        'VolunteerID',
    ];

    public function aidPreparation()
    {
        return $this->belongsTo(AidPreparation::class, 'PreparationID');
    }

    public function volunteer()
    {
        return $this->belongsTo(Volunteer::class, 'VolunteerID');
    }
}
