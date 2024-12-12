// middleware.js
import { NextResponse } from 'next/server'
import Cors from 'cors'

const cors = Cors({
  origin: 'https://hive-admin-v0.vercel.app', // Allow only this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow credentials
})

// Helper function to run the middleware
function runMiddleware(req) {
  return new Promise((resolve, reject) => {
    cors(req, {}, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export async function middleware(req) {
  await runMiddleware(req) // Apply CORS middleware

  // Allow the request to continue
  return NextResponse.next()
}

// Specify which paths this middleware should apply to
export const config = {
  matcher: '/api/:path*', // Apply to all API routes
}
