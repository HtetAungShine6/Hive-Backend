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

    const user = await User.findOne({ email })

    if (user) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
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

    const savedUser = await newUser.save()

    const token = jwt.sign(
      {
        id: savedUser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    )

    return NextResponse.json({
      success: true,
      message: savedUser,
      token,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
