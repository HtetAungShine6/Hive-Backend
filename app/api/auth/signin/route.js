import User from '@/models/User.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextResponse, NextRequest } from 'next/server'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    const user = await User.findOne({
      email,
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User does not exist',
      })
    }

    const isCorrect = await bcryptjs.compare(password, user.password)

    if (!isCorrect) {
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    })

    return NextResponse.json({
      success: true,
      message: {
        token,
        user,
      },
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    })
  }
}
