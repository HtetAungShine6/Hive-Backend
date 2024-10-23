import Event from '@/models/Event'
import User from '@/models/User'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req) {
  try {
    const events = await Event.find()

    // Format the events
    const formattedEvents = await Promise.all(
      events.map(async event => {
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

        // Fetch updated participant info
        const updatedParticipants = await Promise.all(
          event.participants.map(async participant => {
            const user = await User.findById(participant.userid)
            if (user) {
              // Use the updated user data
              return {
                userid: user._id,
                name: user.name,
                profileImageUrl: user.profileImageUrl,
                bio: user.bio,
              }
            }
            // If user not found, return the existing participant data
            return participant
          })
        )

        const updatedOrganizer = await User.findById(event.organizer)
        const organizerDetails = updatedOrganizer
          ? {
              userid: updatedOrganizer._id,
              name: updatedOrganizer.name,
              profileImageUrl: updatedOrganizer.profileImageUrl,
              bio: updatedOrganizer.bio,
            }
          : event.organizer

        return {
          ...event.toObject(),
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          startTime: formattedStartTime,
          endTime: formattedEndTime,
          participants: updatedParticipants, 
          organizer: organizerDetails,
        }
      })
    )

    return NextResponse.json({ success: true, message: formattedEvents })
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}
