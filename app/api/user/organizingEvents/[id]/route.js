import { NextResponse } from 'next/server'
import Event from '../../../../../models/Event'
import User from '../../../../../models/User'

// Helper function for formatting date
const formatDate = (date) => (date ? date.toISOString().split('T')[0] : null)

// Helper function for formatting time
const formatTime = (date) =>
  date
    ? date.toISOString().split('T')[1].split(':')[0] +
      ':' +
      date.toISOString().split('T')[1].split(':')[1]
    : null

export async function GET(req, { params }) {
  const { id } = params

  try {
    // Find events organized by the user
    const organizingEvents = await Event.find({ organizer: id })

    // Format event details and get organizer info
    const formattedEvents = await Promise.all(
      organizingEvents.map(async (event) => {
        let organizerDetails = null

        // Fetch organizer details
        if (event.organizer) {
          const organizer = await User.findById(event.organizer)
          if (organizer) {
            organizerDetails = {
              _id: organizer._id,
              name: organizer.name,
              profileImageUrl: organizer.profileImageUrl,
              instagramLink: organizer.instagramLink,
              verificationStatus: organizer.verificationStatus,
              bio: organizer.bio,
              about: organizer.about,
            }
          }
        }

        // Format event data
        return {
          ...event.toObject(),
          startDate: formatDate(event.startDate),
          endDate: formatDate(event.endDate),
          startTime: formatTime(event.startDate),
          endTime: formatTime(event.endDate),
          organizer: organizerDetails,
        }
      })
    )

    return NextResponse.json(
      {
        success: true,
        message: formattedEvents,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error retrieving organized events:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error retrieving events',
      },
      { status: 500 }
    )
  }
}
