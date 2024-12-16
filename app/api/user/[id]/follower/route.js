import Relationship from '../../../../../models/Relationship'
import mongoose from 'mongoose'
import { NextResponse } from 'next/server'

export async function GET(req, { params }) {
  const { id } = params

  // Validate the ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: 'Invalid user ID' },
      { status: 400 }
    )
  }

  try {
    // Find relationships where the given ID is being followed
    const follower = await Relationship.find({ following: id }).populate(
      'follower',
      '_id name profileImageUrl verificationStatus bio'
    )

    if (!follower.length) {
      return NextResponse.json({ success: true, follower: [] }, { status: 200 })
    }

    // Map and filter the results
    const result = follower
      .filter((relationship) => relationship.follower) // Exclude null references
      .map((relationship) => ({
        _id: relationship.follower._id,
        name: relationship.follower.name,
        profileImageUrl: relationship.follower.profileImageUrl,
        verificationStatus: relationship.follower.verificationStatus,
        bio: relationship.follower.bio,
      }))

    return NextResponse.json(
      { success: true, followers: result },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching followers:', error.message, error.stack)
    return NextResponse.json(
      { success: false, message: 'Error fetching followers' },
      { status: 500 }
    )
  }
}
