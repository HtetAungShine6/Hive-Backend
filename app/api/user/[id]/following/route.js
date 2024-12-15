import Relationship from '@/models/Relationship';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params; 

  // Validate the ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
  }

  try {
    // Find relationships where the given ID is being followed
    const following = await Relationship.find({ follower: id }).populate('following', '_id name profileImageUrl');

    if (!following.length) {
      return NextResponse.json({ success: true, following: [] }, { status: 200 });
    }

    // Map and filter the results
    const result = following
      .filter(relationship => relationship.following) // Exclude null references
      .map(relationship => ({
        id: relationship.following._id,
        name: relationship.following.name,
        profileImageUrl: relationship.following.profileImageUrl,
        bio: relationship.following.bio,
      }));

    return NextResponse.json({ success: true, following: result }, { status: 200 });
  } catch (error) {
    console.error('Error fetching following:', error.message, error.stack);
    return NextResponse.json({ success: false, message: 'Error fetching following' }, { status: 500 });
  }
}
