<?php

namespace App\Http\Controllers;

use App\Services\ReliefCenterService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ReliefCenterController extends Controller
{
    protected $reliefCenterService;

    public function __construct(ReliefCenterService $reliefCenterService)
    {
        $this->reliefCenterService = $reliefCenterService;
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'CenterName' => 'required|string|max:255',
            'Location' => 'required|string|max:255',
            'NumberOfVolunteersWorking' => 'required|integer|min:0',
            'MaxVolunteersCapacity' => 'required|integer|min:1',
            'ManagerID' => 'required|exists:users,UserID',
        ]);

        $reliefCenter = $this->reliefCenterService->createReliefCenter($validatedData);
        return response()->json($reliefCenter, Response::HTTP_CREATED);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'CenterName' => 'sometimes|required|string|max:255',
            'Location' => 'sometimes|required|string|max:255',
            'NumberOfVolunteersWorking' => 'sometimes|required|integer|min:0',
            'MaxVolunteersCapacity' => 'sometimes|required|integer|min:1',
            'ManagerID' => 'sometimes|required|exists:users,UserID',
        ]);

        $reliefCenter = $this->reliefCenterService->updateReliefCenter($id, $validatedData);
        return response()->json($reliefCenter, Response::HTTP_OK);
    }

    public function destroy($id)
    {
        $this->reliefCenterService->deleteReliefCenter($id);
        return response()->json(['message' => 'Relief center deleted successfully'], Response::HTTP_NO_CONTENT);
    }

    public function show($id)
    {
        $reliefCenter = $this->reliefCenterService->getReliefCenterById($id);
        return response()->json($reliefCenter, Response::HTTP_OK);
    }

    public function index()
    {
        $reliefCenters = $this->reliefCenterService->getAllReliefCenters();
        return response()->json($reliefCenters, Response::HTTP_OK);
    }
}
