import Event from '@/models/Event.js'
import { NextRequest, NextResponse } from 'next/server'

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
