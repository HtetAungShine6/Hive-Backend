import Event from '@/models/Event'
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

export async function POST(req) {
  const decoded = verifyToken(req)
  if (!decoded) {
    return NextResponse.json({
      success: false,
      message: 'Unauthorized',
    }, { status: 401 })
  }

  const userId = decoded.id;
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
    !category
  ) {
    return NextResponse.json(
      { success: false, message: 'Please fill in all required fields' },
      { status: 400 }
    )
  }

  const startDateTime = new Date(`${startDate}T${startTime}:00`)
  const endDateTime = new Date(`${endDate}T${endTime}:00`)

  const newEvent = new Event({
    eventImageUrl,
    name,
    location,
    startDate: startDateTime,
    endDate: endDateTime,
    startTime: startDateTime,
    endTime: endDateTime,
    maxParticipants,
    isLimited,
    category,
    additionalInfo,
    organizer: userId,
  })

  await newEvent.save()

  return NextResponse.json({ success: true, message: newEvent }, { status: 201 })
}
