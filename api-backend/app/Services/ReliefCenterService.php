<?php
namespace App\Services;

use App\Models\ReliefCenter;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ReliefCenterService
{
    public function createReliefCenter($data)
    {
        return ReliefCenter::create($data);
    }

    public function updateReliefCenter($id, $data)
    {
        $reliefCenter = ReliefCenter::findOrFail($id);
        $reliefCenter->update($data);
        return $reliefCenter;
    }

    public function deleteReliefCenter($id)
    {
        $reliefCenter = ReliefCenter::findOrFail($id);
        $reliefCenter->delete();
        return true;
    }

    public function getReliefCenterById($id)
    {
        return ReliefCenter::findOrFail($id);
    }

    public function getAllReliefCenters()
    {
        return ReliefCenter::all();
    }
}
