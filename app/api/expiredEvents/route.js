import ExpiredEvent from '@/models/ExpiredEvent';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const expiredEvents = await ExpiredEvent.find();

    // Format the expired events
    const formattedExpiredEvents = expiredEvents.map(event => {
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

    return NextResponse.json({ success: true, expiredEvents: formattedExpiredEvents }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
