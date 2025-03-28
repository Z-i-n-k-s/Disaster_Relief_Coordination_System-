<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\DonationService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Response;

class DonationController extends Controller
{
    protected $donationService;

    public function __construct(DonationService $donationService)
    {
        $this->donationService = $donationService;
    }

    // Create a donation and update resources accordingly.
    public function create(Request $request)
    {
        $validated = $request->validate([
            'DonorName'        => 'required|string',
            'DonationType'     => 'required|string|in:Food,Water,Clothes,Money',
            'Quantity'         => 'required|integer',
            'DateReceived'     => 'required|date',
            'AssociatedCenter' => 'required|integer|exists:relief_centers,CenterID',
            'UserID'           => 'required|integer|exists:users,UserID',
        ]);

        try {
            $donation = $this->donationService->createDonation($validated);
            return response()->json([
                'success' => true,
                'error'   => false,
                'data'    => $donation,
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error'   => true,
                'message' => 'Donation creation failed: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Get donation history for the current user.
    public function userDonations(Request $request)
    {
        try {
            $userId = $request->attributes->get('userId');
            if (!$userId) {
                throw new \Exception("User ID not provided");
            }
            $donations = $this->donationService->getUserDonations($userId);
            return response()->json([
                'success' => true,
                'error'   => false,
                'data'    => $donations,
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error'   => true,
                'message' => 'Error retrieving donation history: ' . $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    // Get all donations (admin only).
    public function allDonations()
    {
        try {
            if (Auth::user()->Role !== 'Admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                ], Response::HTTP_FORBIDDEN);
            }
            $donations = $this->donationService->getAllDonations();
            return response()->json([
                'success' => true,
                'error'   => false,
                'data'    => $donations,
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error'   => true,
                'message' => 'Error retrieving donations: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
