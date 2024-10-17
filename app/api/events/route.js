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
