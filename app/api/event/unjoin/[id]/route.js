import User from '../../../../../models/User'
import Event from '../../../../../models/Event'
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

export async function POST(req, { params }) {
  const decoded = verifyToken(req)
  if (!decoded) {
    return NextResponse.json({
      success: false,
      message: 'Unauthorized',
    })
  }
  const { userid } = await req.json()
  console.log('userid', userid)
  const { id } = params

  try {
    const event = await Event.findById(id)
    if (!event) {
      return NextResponse.json({ success: false, message: 'Event not found' })
    }
    const user = await User.findById(userid)

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' })
    }

    if (!event.participants.includes(userid)) {
      return NextResponse.json({
        success: false,
        message: 'User not joined',
      })
    }

    event.participants = event.participants.filter(
      (participant) => participant !== userid
    )

    await event.save()

    return NextResponse.json({
      success: true,
      message: 'User unjoined',
    })
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message })
  }
}
