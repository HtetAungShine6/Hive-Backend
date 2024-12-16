import Event from '../../../../models/Event'
import User from '../../../../models/User'
import { NextResponse } from 'next/server'

export async function GET(req, { params }) {
  const { id } = params
  try {
    const event = await Event.findById(id)

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      )
    }

    // Format the startDate and endDate
    const formattedStartDate = event.startDate
      ? event.startDate.toISOString().split('T')[0]
      : null

    const formattedEndDate = event.endDate
      ? event.endDate.toISOString().split('T')[0]
      : null

    // Format the startTime and endTime (if you want to include them as well)
    const formattedStartTime = event.startTime
      ? event.startTime.toISOString().split('T')[1].split(':')[0] +
        ':' +
        event.startTime.toISOString().split('T')[1].split(':')[1]
      : null

    const formattedEndTime = event.endTime
      ? event.endTime.toISOString().split('T')[1].split(':')[0] +
        ':' +
        event.endTime.toISOString().split('T')[1].split(':')[1]
      : null

    const updatedParticipants = await Promise.all(
      event.participants.map(async (participant) => {
        const user = await User.findById(participant.userid)
        if (user) {
          return {
            userid: user._id,
            name: user.name,
            profileImageUrl: user.profileImageUrl,
            instagramLink: user.instagramLink,
            verificationStatus: user.verificationStatus,
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
          instagramLink: updatedOrganizer.instagramLink,
          verificationStatus: updatedOrganizer.verificationStatus,
          bio: updatedOrganizer.bio,
        }
      : event.organizer

    const updatedPendingParticipants = await Promise.all(
      event.pendingParticipants.map(async (pendingParticipant) => {
        const user = await User.findById(pendingParticipant.userid)
        if (user) {
          return {
            userid: user._id,
            name: user.name,
            profileImageUrl: user.profileImageUrl,
            instagramLink: user.instagramLink,
            verificationStatus: user.verificationStatus,
            bio: user.bio,
          }
        }
        // If user not found, return the existing participant data
        return pendingParticipant
      })
    )

    return NextResponse.json(
      {
        success: true,
        message: {
          ...event.toObject(),
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          startTime: formattedStartTime,
          endTime: formattedEndTime,
          participants: updatedParticipants,
          organizer: organizerDetails,
          pendingParticipants: updatedPendingParticipants,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Error retrieving event',
      },
      { status: 500 }
    )
  }
}
