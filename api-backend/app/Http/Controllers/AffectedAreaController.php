<?php

namespace App\Http\Controllers;

use App\Services\AffectedAreaService;
use Illuminate\Http\Request;
use Exception;

class AffectedAreaController extends Controller
{
    protected $affectedAreaService;

    public function __construct(AffectedAreaService $affectedAreaService)
    {
        $this->affectedAreaService = $affectedAreaService;
    }

    // List all affected areas
    public function index()
    {
        try {
            $areas = $this->affectedAreaService->getAll();
            return response()->json($areas, 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Error fetching affected areas'], 500);
        }
    }

    // Create a new affected area
    public function store(Request $request)
    {
        try {
            $data = $request->all();
            $area = $this->affectedAreaService->create($data);
            return response()->json($area, 201);
        } catch (Exception $e) {
            return response()->json(['error' => 'Error creating affected area'], 500);
        }
    }

    // Retrieve a specific affected area by ID
    public function show($id)
    {
        try {
            $area = $this->affectedAreaService->getById($id);
            if (!$area) {
                return response()->json(['error' => 'Affected area not found'], 404);
            }
            return response()->json($area, 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Error fetching affected area'], 500);
        }
    }

    // Update an existing affected area
    public function update(Request $request, $id)
    {
        try {
            $data = $request->all();
            $updated = $this->affectedAreaService->update($id, $data);
            if (!$updated) {
                return response()->json(['error' => 'Affected area not found or update failed'], 404);
            }
            return response()->json(['message' => 'Affected area updated successfully'], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Error updating affected area'], 500);
        }
    }

    // Delete an affected area
    public function destroy($id)
    {
        try {
            $deleted = $this->affectedAreaService->delete($id);
            if (!$deleted) {
                return response()->json(['error' => 'Affected area not found or delete failed'], 404);
            }
            return response()->json(['message' => 'Affected area deleted successfully'], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Error deleting affected area'], 500);
        }
    }
}
