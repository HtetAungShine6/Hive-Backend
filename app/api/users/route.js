import User from '@/models/User.js'
import e from 'cors'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const users = await User.find().select('-password') 

    return NextResponse.json({
      success: true,
      message: users,
    })
  } catch (error) {
    return NextResponse.json(error)
  }
}
