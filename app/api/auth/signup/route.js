import User from '@/models/User'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const {
      name,
      email,
      password,
      dateOfBirth,
      gender,
      profileImageUrl,
      about,
      bio,
      instagramLink,
      isOrganizer,
      isSuspened,
      verificatinImageUrl,
    } = await request.json()

    // Check if the user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'User already exists',
      }, { status: 400 })
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      profileImageUrl,
      about,
      bio,
      instagramLink,
      isOrganizer,
      isSuspened,
      verificatinImageUrl,
      verificationStatus: 'notVerified',
    })

    const user = await newUser.save()

    // Generate a JWT token
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    )

    // Format the date to "YYYY-MM-DD"
    const formattedDateOfBirth = user.dateOfBirth.toISOString().split('T')[0]

    // Return the response with token and user details
    return NextResponse.json({
      success: true,
      message: {
        token,
        user: {
          ...user.toObject(),
          dateOfBirth: formattedDateOfBirth,  // formatted date
        }
      }
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
