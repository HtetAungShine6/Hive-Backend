import Event from '@/models/Event'
import { NextResponse } from 'next/server'

export async function GET(req, { params }) {
  const { id } = params
  try {
    const event = await Event.findById(id)

    if (!event) {
      return NextResponse.json({ success: false, message: 'Event not found' })
    }

    // Format the startDate and endDate
    const formattedStartDate = event.startDate
      ? event.startDate.toISOString().split('T')[0]
      : null;

    const formattedEndDate = event.endDate
      ? event.endDate.toISOString().split('T')[0]
      : null;

    // Format the startTime and endTime (if you want to include them as well)
    const formattedStartTime = event.startTime
      ? event.startTime.toISOString().split('T')[1].split(':')[0] + ':' + event.startTime.toISOString().split('T')[1].split(':')[1]
      : null;

    const formattedEndTime = event.endTime
      ? event.endTime.toISOString().split('T')[1].split(':')[0] + ':' + event.endTime.toISOString().split('T')[1].split(':')[1]
      : null;

    return NextResponse.json({
      success: true,
      message: {
        ...event.toObject(),
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      },
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error retrieving event',
    })
  }
}
