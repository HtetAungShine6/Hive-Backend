import User from '@/models/User'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Find the user by email
    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User does not exist',
      }, { status: 404 })
    }

    // Check if the password is correct
    const isCorrect = await bcryptjs.compare(password, user.password)

    if (!isCorrect) {
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials',
      }, { status: 401 })
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    })

    // Format the dateOfBirth (if available) to "YYYY-MM-DD"
    const formattedDateOfBirth = user.dateOfBirth
      ? user.dateOfBirth.toISOString().split('T')[0]
      : null

    // Return response with the token and user details
    return NextResponse.json({
      success: true,
      message: {
        token,
        user: {
          ...user.toObject(),
          dateOfBirth: formattedDateOfBirth, // formatted date
        },
      },
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    }, { status: 500 })
  }
}
