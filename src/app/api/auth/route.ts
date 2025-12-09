import { NextRequest, NextResponse } from "next/server";

// Mock user database
const mockUsers = [
  {
    id: "user_1",
    email: "trader@kyzlo.io",
    name: "Marcus Aurelius",
    password: "hashed_password_here", // In production, use bcrypt
  },
];

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

/**
 * POST /api/auth
 * Handles login and signup requests
 *
 * TODO: Implement actual authentication
 * - Use bcrypt for password hashing
 * - Generate JWT tokens
 * - Store sessions in database
 * - Implement refresh token rotation
 * - Add rate limiting
 * - Add email verification for signup
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = request.nextUrl.searchParams.get("action") || "login";

    if (action === "login") {
      const { email, password } = body as LoginRequest;

      // TODO: Validate input
      // TODO: Check credentials against database
      // TODO: Generate JWT token

      // Mock response
      const user = mockUsers.find((u) => u.email === email);
      if (!user) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token: "mock_jwt_token_xxxxxxxxxxxx", // TODO: Generate real JWT
      });
    }

    if (action === "signup") {
      const { email, password, name } = body as SignupRequest;

      // TODO: Validate input
      // TODO: Check if user already exists
      // TODO: Hash password
      // TODO: Create user in database
      // TODO: Send verification email

      // Mock response
      return NextResponse.json({
        success: true,
        user: {
          id: "new_user_" + Date.now(),
          email,
          name,
        },
        message: "Account created. Please verify your email.",
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth
 * Returns current user session
 *
 * TODO: Implement session validation
 * - Validate JWT from Authorization header
 * - Return user data from database
 */
export async function GET(request: NextRequest) {
  // TODO: Validate session token from headers
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Mock response
  return NextResponse.json({
    user: {
      id: "user_1",
      email: "trader@kyzlo.io",
      name: "Marcus Aurelius",
      createdAt: "2024-01-01T00:00:00Z",
    },
  });
}
