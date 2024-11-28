import User from '@/models/User'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function GET(req, { params }) {
  const { id } = params
  try {
    const user = await User.findById(id).select('-password')

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    const formattedDateOfBirth = user.dateOfBirth
      ? user.dateOfBirth.toISOString().split('T')[0]
      : null;

    return NextResponse.json({
      success: true,
      message: {
        ...user.toObject(),
        dateOfBirth: formattedDateOfBirth, 
      },
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error retrieving user',
    }, { status: 500 })
  }
}

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

export async function PUT(req, { params }) {
  const decoded = verifyToken(req)
  if (!decoded) {
    return NextResponse.json({
      success: false,
      message: 'Unauthorized',
    }, { status: 401 })
  }

  const userIdFromToken = decoded.id
  const { id } = params

  // Check if the user is trying to update their own profile
  if (userIdFromToken !== id) {
    return NextResponse.json({
      success: false,
      message: 'Forbidden: You can only update your own profile',
    }, { status: 403 })
  }

  try {
    const user = await User.findById(id)
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    // Parse the request body
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
      verificationStatus,
    } = await req.json()

    // Update user fields
    user.name = name || user.name
    user.email = email || user.email
    user.dateOfBirth = dateOfBirth || user.dateOfBirth
    user.gender = gender || user.gender
    user.profileImageUrl = profileImageUrl || user.profileImageUrl
    user.about = about || user.about
    user.bio = bio || user.bio
    user.instagramLink = instagramLink || user.instagramLink
    user.isOrganizer = isOrganizer !== undefined ? isOrganizer : user.isOrganizer
    user.isSuspened = isSuspened !== undefined ? isSuspened : user.isSuspened

    // If the password is provided, hash it and update
    if (password) {
      const salt = await bcryptjs.genSalt(10)
      const hashedPassword = await bcryptjs.hash(password, salt)
      user.password = hashedPassword
    }

    if (verificationStatus) {
      const allowedStatuses = ['verified', 'rejected', 'pending', 'notVerified'];
      if (!allowedStatuses.includes(verificationStatus)) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid verificationStatus value',
          },
          { status: 400 }
        );
      }
      user.verificationStatus = verificationStatus;
    }
    
    // Save the updated user
    const updatedUser = await user.save()

    return NextResponse.json({ success: true, message: 'User updated successfully', user: updatedUser }, { status: 200 })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({
      success: false,
      message: 'Error updating user',
    }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  const decoded = verifyToken(req)
  if (!decoded) {
    return NextResponse.json(
      {
        success: false,
        message: 'Unauthorized',
      },
      { status: 401 }
    )
  }

  const userIdFromToken = decoded.id
  const { id } = params

  if (userIdFromToken !== id) {
    return NextResponse.json(
      {
        success: false,
        message: 'Forbidden: You can only delete your own profile',
      },
      { status: 403 }
    )
  }

  try {
    const user = await User.findByIdAndDelete(id)
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error deleting user',
      },
      { status: 500 }
    )
  }
}