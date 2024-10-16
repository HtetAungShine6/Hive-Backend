import { NextResponse, NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

// Define the secret key from environment variables
const secret = process.env.JWT_SECRET

export async function middleware(request) {
  const token = request.headers.get('Authorization')?.split(' ')[1] // Extract the token from Authorization header

  if (!token) {
    return NextResponse.json(
      { message: 'No token provided', success: false },
      { status: 401 }
    )
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, secret)

    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid token', success: false },
        { status: 403 }
      )
    }

    // Proceed to the requested page or API if token is valid
    return NextResponse.next()
  } catch (error) {
    // If the token is invalid or expired
    return NextResponse.json(
      { message: 'Invalid or expired token', success: false },
      { status: 403 }
    )
  }
}

// Define protected routes here
export const config = {
  matcher: ['/dashboard/:path*', '/user/:path*'], // Add paths that need protection
}
