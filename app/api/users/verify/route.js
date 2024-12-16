import User from '@/models/User'
import { NextResponse } from 'next/server'

export async function PUT(req) {
  const { userid } = await req.json()
  try {
    const user = await User.findById(userid)
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }
    user.verificationStatus = 'approved'
    await user.save()

    return NextResponse.json(
      { success: true, message: 'User verified successfully', user: user },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error verifying user:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error verifying user',
      },
      { status: 500 }
    )
  }
}
