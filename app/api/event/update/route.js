import Event from '@models/Event.js'
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

export async function PUT(res) {
  const decoded = verifyToken(req)
  if (!decoded) {
    return NextResponse.json({
      success: false,
      message: 'Unauthorized',
    })
  }
  const {
    eventImageUrl,
    name,
    location,
    startDate,
    endDate,
    startTime,
    endTime,
    maxParticipants,
    isLimited,
    category,
    additionalInfo,
    organizer,
  } = await req.json()

  if (
    !name ||
    !location ||
    !startDate ||
    !endDate ||
    !startTime ||
    !endTime ||
    !category ||
    !organizer
  ) {
    return NextResponse.json(
      { success: false, message: 'Please fill in all required fields' },
      { status: 400 }
    )
  }

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        eventImageUrl,
        name,
        location,
        startDate,
        endDate,
        startTime,
        endTime,
        maxParticipants,
        isLimited,
        category,
        additionalInfo,
        organizer,
      },
      { new: true }
    )

    return NextResponse.json({ success: true, message: updatedEvent })
  } catch (err) {
    return NextResponse.json({ success: false, message: err })
  }
}
