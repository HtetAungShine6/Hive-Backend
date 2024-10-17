import User from '@/models/User'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET

const verifyToken = (req) => {
  const token = req.headers.get('Authorization')?.split(' ')[1]
  console.log('token', token)
  if (!token) {
    return false
  }
  try {
    return jwt.verify(token, secret)
  } catch (err) {
    return false
  }
}

export async function GET(req, res) {
  try {
    const decoded = verifyToken(req)
    if (!decoded) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      })
    }

    const users = await User.find().select('-password')

    return NextResponse.json({
      success: true,
      message: users,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
      status: 500,
    })
  }
}
