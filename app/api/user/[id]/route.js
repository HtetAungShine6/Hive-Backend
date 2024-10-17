import User from '@/models/User'
import { NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'

export async function GET(req, { params }) {
  const { id } = params
  try {
    const user = await User.findById(id).select('-password')

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' })
    }

    return NextResponse.json({ success: true, message: user })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error retrieving user',
    })
  }
}

export async function PUT(req, { params }) {
  const { id } = params
  try {
    const user = await User.findById(id)

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' })
    }

    const {
      name,
      email,
      dateOfBirth,
      gender,
      profileImageUrl,
      about,
      bio,
      instagramLink,
      isOrganizer,
      isSuspened,
      password,
    } = await req.json()

    user.name = name || user.name
    user.email = email || user.email
    user.dateOfBirth = dateOfBirth || user.dateOfBirth
    user.gender = gender || user.gender
    user.profileImageUrl = profileImageUrl || user.profileImageUrl
    user.about = about || user.about
    user.bio = bio || user.bio
    user.instagramLink = instagramLink || user.instagramLink
    user.isOrganizer =
      isOrganizer !== undefined ? isOrganizer : user.isOrganizer
    user.isSuspened = isSuspened !== undefined ? isSuspened : user.isSuspened
    if (password) {
      const salt = await bcryptjs.genSalt(10)
      const hashedPassword = await bcryptjs.hash(password, salt)
      user.password = hashedPassword
    }
    const updatedUser = await user.save()

    return NextResponse.json({ success: true, message: updatedUser })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error updating user',
    })
  }
}
