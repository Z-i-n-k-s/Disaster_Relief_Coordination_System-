<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\DonationService;
use Illuminate\Support\Facades\Auth;

class DonationController extends Controller
{
    protected $donationService;

    public function __construct(DonationService $donationService)
    {
        $this->donationService = $donationService;
    }

    // Method to handle creating a donation
    public function create(Request $request)
    {
        // Validate incoming data
        $validated = $request->validate([
            'DonorName' => 'required|string',
            'DonationType' => 'required|string',
            'Quantity' => 'required|integer',
            'DateReceived' => 'required|date',
            'AssociatedCenter' => 'required|integer|exists:relief_centers,CenterID',
            'UserID' => 'required|integer|exists:users,UserID',
            'ResourceID' => 'required|integer|exists:resources,ResourceID',
        ]);

        // Call the service to create the donation
        $donation = $this->donationService->createDonation($validated);

        return response()->json([
            'success' => true,
            'data' => $donation,
        ]);
    }

    // Method for users to get their donations history
    public function userDonations(Request $request)
    {
        $userId = Auth::id();  // Get the currently authenticated user ID
        
        $donations = $this->donationService->getUserDonations($userId);

        return response()->json([
            'success' => true,
            'error'=>false,
            'data' => $donations,
        ]);
    }

    // Method for admins to get all donations history
    public function allDonations()
    {
        // Ensure the user is an admin
        if (Auth::user()->Role !== 'Admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $donations = $this->donationService->getAllDonations();

        return response()->json([
            'success' => true,
            'error'=>false,
            'data' => $donations,
        ]);
    }
}
