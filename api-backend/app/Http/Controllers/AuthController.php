<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'Email' => 'required|email|unique:users,Email',
            'Name' => 'required|string|max:255',
            'Password' => 'required|string|min:6|confirmed',
            'PhoneNo' => 'required|string|max:20',
            'Role' => 'required|in:User,Volunteer',
            'AssignedCenter' => 'required_if:Role,Volunteer|exists:relief_centers,CenterID',
        ]);

        if ($validatedData['Role'] === 'Volunteer') {
            $user = $this->authService->registerVolunteer($validatedData);
        } else {
            $user = $this->authService->registerUser($validatedData);
        }

        $accessToken = JWTAuth::customClaims(['type' => 'access'])->fromUser($user);

        // Generate Refresh Token (5 hours)
        $refreshToken = JWTAuth::customClaims([
            'type' => 'refresh',
            'exp' => now()->addHours(5)->timestamp // Custom expiration
        ])->fromUser($user);

        $cookieOptions = [
            'httpOnly' => true,
            'secure' => true, // (set to false for local testing if not using HTTPS)
            'sameSite' => 'Strict',
        ];

        // Return a successful response
        return response()->json([
            'success' => true,
            'error' => false,
            'message' => 'Registration successful',
            'user_info' => $user,
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken
        ], 201)
        ->cookie('access_token', $accessToken, 30, '/', null, $cookieOptions['secure'], $cookieOptions['httpOnly'])
        ->cookie('refresh_token', $refreshToken, 300, '/', null, $cookieOptions['secure'], $cookieOptions['httpOnly']);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'Email' => 'required|email',
            'Password' => 'required|min:6',
        ]);

        // Delegate login logic to AuthService
        $user = $this->authService->login($validated);

        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => true,
                'message' => 'Invalid email or password',
            ], 401); // 401 Unauthorized status code
        }

        // Generate tokens
        // Generate Access Token (30 minutes as per config)
        $accessToken = JWTAuth::customClaims(['type' => 'access'])->fromUser($user);

        // Generate Refresh Token (5 hours)
        $refreshToken = JWTAuth::customClaims([
            'type' => 'refresh',
            'exp' => now()->addHours(5)->timestamp // Custom expiration
        ])->fromUser($user);
        $cookieOptions = [
            'httpOnly' => true,
            'secure' => false, // (set to false for local testing if not using HTTPS)
            'sameSite' => 'Strict',
        ];

        return response()->json([
            'success' => true,
            'error' => false,
            'message' => 'Login successful',
            'user_info' => $user,
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
        ], 200)
        ->cookie('access_token', $accessToken, 30, '/', null, $cookieOptions['secure'], $cookieOptions['httpOnly'])
        ->cookie('refresh_token', $refreshToken, 300, '/', null, $cookieOptions['secure'], $cookieOptions['httpOnly']);
    }

    public function logout(Request $request)
    {
        $res = $this->authService->logout();
        if($res){
            return response()->json([
                    'success' => true,
                    'error' => false,
                    'message' => 'Logged out successfully',
                ], 200)
                ->withCookie(Cookie::forget('access_token'))
                ->withCookie(Cookie::forget('refresh_token'));
        }else{
             return response()->json([
                'success' => false,
                'error' => true,
                'message' => 'Failed to log out',
                
            ], 500);
        }
    }

    public function me()
    {
        return response()->json(JWTAuth::parseToken()->authenticate());
    }
}
