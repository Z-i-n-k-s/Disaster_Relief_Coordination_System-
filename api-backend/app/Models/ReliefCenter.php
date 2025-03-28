<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReliefCenter extends Model
{
    use HasFactory;
    protected $primaryKey = 'CenterID';

    protected $fillable = [
        'CenterName',
        'Location',
        'NumberOfVolunteersWorking',
        'MaxVolunteersCapacity',
        'ManagerID',
    ];

    public function manager()
    {
        return $this->belongsTo(User::class, 'ManagerID');
    }

    public function volunteers()
    {
        return $this->hasMany(Volunteer::class, 'AssignedCenter');
    }

    public function resources()
    {
        return $this->hasMany(Resource::class, 'ReliefCenterID');
    }

    public function donations()
    {
        return $this->hasMany(Donation::class, 'AssociatedCenter');
    }
}
