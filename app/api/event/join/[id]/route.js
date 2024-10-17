import User from '@/models/User.js'
import Event from '@/models/Event.js'
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

    if (event.participants.includes(userid)) {
      return NextResponse.json({
        success: false,
        message: 'User already joined',
      })
    }

    event.participants.push({
      userid: userid,
      name: user.name,
      profileImageUrl: user.profileImageUrl,
      bio: user.bio,
    })

    await event.save()

    return NextResponse.json({
      success: true,
      message: 'Join Successful',
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error retrieving event',
    })
  }
}
