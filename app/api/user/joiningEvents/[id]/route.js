import { NextResponse } from 'next/server'
import Event from '../../../../../models/Event'
import User from '../../../../../models/User'
import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET

const verifyToken = (req) => {
  const token = req.headers.get('Authorization')?.split(' ')[1]
  if (!token) {
    return null
  }
  try {
    return jwt.verify(token, secret)
  } catch (err) {
    console.error('JWT verification error:', err)
    return null
  }
}

// Helper functions for formatting date and time
const formatDate = (date) => (date ? date.toISOString().split('T')[0] : null)
const formatTime = (date) =>
  date
    ? date.toISOString().split('T')[1].split(':').slice(0, 2).join(':')
    : null

export async function GET(req, { params }) {
  const { id } = params
  const decoded = verifyToken(req)

  if (!decoded) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }

  if (decoded.id !== id) {
    return NextResponse.json(
      { success: false, message: 'Forbidden: ID mismatch' },
      { status: 403 }
    )
  }

  try {
    // Fetch joined events
    const joiningEvents = await Event.find({ 'participants.userid': id })

    // Format events and retrieve organizer details
    const formattedEvents = await Promise.all(
      joiningEvents.map(async (event) => {
        let organizerDetails = null
        if (event.organizer) {
          const organizer = await User.findById(event.organizer)
          if (organizer) {
            organizerDetails = {
              userid: organizer._id,
              name: organizer.name,
              profileImageUrl: organizer.profileImageUrl,
              instagramLink: organizer.instagramLink,
              bio: organizer.bio,
            }
          }
        }

        return {
          ...event.toObject(),
          startDate: formatDate(new Date(event.startDate)),
          endDate: formatDate(new Date(event.endDate)),
          startTime: formatTime(new Date(event.startDate)),
          endTime: formatTime(new Date(event.endDate)),
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
    console.error('Error retrieving joined events:', error)
    return NextResponse.json(
      { success: false, message: 'Error retrieving events' },
      { status: 500 }
    )
  }
}
