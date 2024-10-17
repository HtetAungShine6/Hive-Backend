import User from '@/models/User'
import { NextResponse } from 'next/server'
export async function GET(req) {
  try {
    const users = await User.find().select('-password')

    const response = {
      success: true,
      message: users,
    }

    return NextResponse.json({ success: true, message: users })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error retrieving users',
    })
  }
}
