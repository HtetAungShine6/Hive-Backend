import User from '@/models/User'
import { NextResponse } from 'next/server'

export async function PUT(req) {
  const { userid } = await req.json()
  try {
    await User.findByIdAndUpdate(userid, {
      $set: {
        verficatiionStatus: 'approved',
      },
    })

    return NextResponse.json(
      { success: true, message: 'User verified successfully' },
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
