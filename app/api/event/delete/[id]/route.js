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

export async function DELETE(req) {
  const decoded = verifyToken(req)
  if (!decoded) {
    return NextResponse.json({
      success: false,
      message: 'Unauthorized',
    })
  }
  const { id } = req.params

  try {
    const event = await Event.findById(id)
    if (!event) {
      return NextResponse.json({ success: false, message: 'Event not found' })
    }

    await event.delete()

    return NextResponse.json({ success: true, message: 'Event deleted' })
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message })
  }
}