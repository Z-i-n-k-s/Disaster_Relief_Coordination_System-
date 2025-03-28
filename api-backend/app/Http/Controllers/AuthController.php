<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }
    
    public function refreshToken(Request $request)
    {
        $refreshToken = $request->header('X-Refresh-Token');

        if (!$refreshToken) {
            return response()->json(['message' => 'Refresh token not provided'], 401);
        }

        try {
            // Authenticate the user using the refresh token
            $user = JWTAuth::setToken($refreshToken)->authenticate();

            if (!$user) {
                return response()->json(['message' => 'Invalid refresh token'], 401);
            }

            // Generate a new access token with any custom claims as needed
            $newAccessToken = JWTAuth::customClaims(['type' => 'access'])->fromUser($user);

            return response()->json(['access_token' => $newAccessToken], 200);
        } catch (TokenExpiredException $e) {
            return response()->json(['message' => 'Refresh token expired'], 401);
        } catch (TokenInvalidException | JWTException $e) {
            return response()->json(['message' => 'Invalid refresh token'], 401);
        }
    }

    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'Email'           => 'required|email|unique:users,Email',
            'Name'            => 'required|string|max:255',
            'Password'        => 'required|string|min:6|confirmed',
            'PhoneNo'         => 'required|string|max:20',
            'Role'            => 'required|in:User,Volunteer',
            'AssignedCenter'  => 'required_if:Role,Volunteer|exists:relief_centers,CenterID',
        ]);

        if ($validatedData['Role'] === 'Volunteer') {
            $user = $this->authService->registerVolunteer($validatedData);
        } else {
            $user = $this->authService->registerUser($validatedData);
        }
        
        // Convert raw SQL user (stdClass) to User model instance.
        $user = User::find($user->UserID);

        $accessToken = JWTAuth::customClaims(['type' => 'access'])->fromUser($user);

        // Generate Refresh Token (5 hours)
        $refreshToken = JWTAuth::customClaims([
            'type' => 'refresh',
            'exp'  => now()->addHours(5)->timestamp, // Custom expiration
        ])->fromUser($user);

        return response()->json([
            'success'       => true,
            'error'         => false,
            'message'       => 'Registration successful',
            'user_info'     => $user,
            'access_token'  => $accessToken,
            'refresh_token' => $refreshToken
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'Email'    => 'required|email',
            'Password' => 'required|min:6',
        ]);
    
        $user = $this->authService->login($validated);
    
        if (!$user) {
            return response()->json([
                'success' => false,
                'error'   => true,
                'message' => 'Invalid email or password',
            ], 401);
        }
    
        // Convert raw SQL user (stdClass) to a User model instance
        $user = User::find($user->UserID);
    
        // Generate tokens using a valid JWTSubject (User model instance)
        $accessToken = JWTAuth::customClaims(['type' => 'access'])->fromUser($user);
        $refreshToken = JWTAuth::customClaims([
            'type' => 'refresh',
            'exp'  => now()->addHours(5)->timestamp,
        ])->fromUser($user);
    
        return response()->json([
            'success'       => true,
            'error'         => false,
            'message'       => 'Login successful',
            'user_info'     => $user,
            'access_token'  => $accessToken,
            'refresh_token' => $refreshToken,
        ], 200);
    }
    
    public function logout(Request $request)
    {
        $userId = $request->attributes->get('userId');
        error_log($userId);

        $res = $this->authService->logout($userId);

        if ($res) {
            return response()->json([
                'success' => true,
                'error'   => false,
                'message' => 'Logged out successfully',
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'error'   => true,
                'message' => 'Failed to log out',
            ], 500);
        }
    }

    public function me()
    {
        return response()->json(JWTAuth::parseToken()->authenticate());
    }
}
