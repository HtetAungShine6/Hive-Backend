import Event from '@/models/Event.js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req) {
  try {
    const events = await Event.find()
    return NextResponse.json({ success: true, message: events })
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}

export async function POST(req) {
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

  const newEvent = new Event({
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
  })

  await newEvent.save()

  return NextResponse.json({ success: true, message: newEvent })
}
