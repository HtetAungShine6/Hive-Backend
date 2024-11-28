import User from '@/models/User'
import Event from '@/models/Event'
import { NextRequest, NextResponse } from 'next/server'

import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET

const verifyToken = (req) => {
  const token = req.headers.get('Authorization')?.split(' ')[1]
  console.log('token', token)
  if (!token) {
    return false
  }
  try {
    return jwt.verify(token, secret)
  } catch (err) {
    return false
  }
}

export async function POST(req, { params }) {
  const decoded = verifyToken(req)
  if (!decoded) {
    return NextResponse.json({
      success: false,
      message: 'Unauthorized',
    }, { status: 401 })
  }

  const userId = decoded.id;
  const { id } = params

  try {
    const event = await Event.findById(id)
    if (!event) {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 })
    }
    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    if (event.organizer === userId) {
      return NextResponse.json({
        success: false,
        message: 'Organizer cannot join their own event',
      }, { status: 409 })
    }

    if (event.participants.some(participant => participant.userid === userId)) {
      return NextResponse.json({
        success: false,
        message: 'User already joined',
      }, { status: 409 })
    }

    if (event.pendingParticipants.some(pendingParticipant => pendingParticipant.userid === userId)) {
      return NextResponse.json({
        success: false,
        message: 'User already pending',
      }, { status: 409 })
    }

    // event.participants.push({
    //   userid: userId,
    //   name: user.name,
    //   profileImageUrl: user.profileImageUrl,
    //   bio: user.bio,
    // })

    if (event.participants.length >= event.maxParticipants) {
      return NextResponse.json(
        {
          success: false,
          message: 'Event has reached the maximum number of participants',
        },
        { status: 409 }
      )
    }

    if (event.isPrivate) {
      event.pendingParticipants.push({
        userid: userId,
        name: user.name,
        profileImageUrl: user.profileImageUrl,
        bio: user.bio,
      })
    } else {
      event.participants.push({
        userid: userId,
        name: user.name,
        profileImageUrl: user.profileImageUrl,
        bio: user.bio,
      })
    }

    await event.save()

    return NextResponse.json({
      success: true,
      message: 'Join Successful',
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error retrieving event',
    }, { status: 500 })
  }
}
