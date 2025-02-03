<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $primaryKey = 'UserID';

    protected $fillable = [
        'Email',
        'Name',
        'Password',
        'Role',
        'PhoneNo',
    ];

    protected $hidden = [
        'Password',
    ];

    // Implementing the required methods for JWT
    public function getJWTIdentifier()
    {
        return $this->getKey(); // This returns the UserID
    }

    public function getJWTCustomClaims()
    {
        return []; // You can add custom claims if needed
    }

    public function volunteer(): HasOne
    {
        return $this->hasOne(Volunteer::class, 'UserID', 'UserID');
    }
}
