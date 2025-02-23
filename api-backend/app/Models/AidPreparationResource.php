<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AidPreparationResource extends Model
{
    use HasFactory;

    protected $fillable = [
        'PreparationID',
        'ResourceID',
        'QuantityUsed',
    ];

    public function aidPreparation()
    {
        return $this->belongsTo(AidPreparation::class, 'PreparationID');
    }

    public function resource()
    {
        return $this->belongsTo(Resource::class, 'ResourceID');
    }
}
