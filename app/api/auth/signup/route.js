import User from '@/models/User.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextResponse, NextRequest } from 'next/server'

export async function POST(request) {
  try {
    const {
      name,
      email,
      password,
      date_of_birth,
      gender,
      profileImageUrl,
      about,
      bio,
      instagramLink,
      isOrganizer,
      isSuspened,
    } = await request.json()

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'User already exists',
      })
    }

    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      date_of_birth,
      gender,
      profileImageUrl,
      about,
      bio,
      instagramLink,
      isOrganizer,
      isSuspened,
    })

    const user = await newUser.save()

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    )

    return NextResponse.json({
      success: true,
      message: {
        token,
        user
      }
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message })
  }
}
