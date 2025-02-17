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
            'DonorName'        => 'required|string',
            'DonationType'     => 'required|string|in:Food,Water,Clothes,Money',
            'Quantity'         => 'required|integer',
            'DateReceived'     => 'required|date',
            'AssociatedCenter' => 'required|integer|exists:relief_centers,CenterID',
            'UserID'           => 'required|integer|exists:users,UserID',
            
        ]);

        // Call the service to create the donation
        $donation = $this->donationService->createDonation($validated);

        return response()->json([
            'success' => true,
            'error'   => false,
            'data'    => $donation,
        ]);
    }

    // Method for users to get their donation history
    public function userDonations(Request $request)
    {
        $userId = $request->attributes->get('userId');

        $donations = $this->donationService->getUserDonations($userId);

        return response()->json([
            'success' => true,
            'error'   => false,
            'data'    => $donations,
        ]);
    }

    // Method for admins to get all donation history
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
            'error'   => false,
            'data'    => $donations,
        ]);
    }
}
