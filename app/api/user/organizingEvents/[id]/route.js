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

const formatDate = (date) => (date ? date.toISOString().split('T')[0] : null)

const formatTime = (date) =>
  date
    ? date.toISOString().split('T')[1].split(':')[0] +
      ':' +
      date.toISOString().split('T')[1].split(':')[1]
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
    const organizingEvents = await Event.find({ organizer: id })

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
              bio: organizer.bio,
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
