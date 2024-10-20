import Event from '@/models/Event'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req) {
  try {
    const events = await Event.find()

    // Format the events
    const formattedEvents = events.map(event => {
      const formattedStartDate = event.startDate
        ? event.startDate.toISOString().split('T')[0]
        : null;

      const formattedEndDate = event.endDate
        ? event.endDate.toISOString().split('T')[0]
        : null;

      const formattedStartTime = event.startTime
        ? event.startTime.toISOString().split('T')[1].split(':')[0] + ':' + event.startTime.toISOString().split('T')[1].split(':')[1]
        : null;

      const formattedEndTime = event.endTime
        ? event.endTime.toISOString().split('T')[1].split(':')[0] + ':' + event.endTime.toISOString().split('T')[1].split(':')[1]
        : null;

      return {
        ...event.toObject(),
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      };
    });

    return NextResponse.json({ success: true, message: formattedEvents });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
