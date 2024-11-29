import Relationship from '@/models/Relationship';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params; // ID of the user whose followers we want to fetch

  try {
    const followers = await Relationship.find({ following: id }).populate('follower', '_id name profileImageUrl');

    const result = followers.map(relationship => ({
      id: relationship.follower._id,
      name: relationship.follower.name,
      profileImageUrl: relationship.follower.profileImageUrl,
    }));

    return NextResponse.json({ success: true, followers: result }, { status: 200 });
  } catch (error) {
    console.error('Error fetching followers:', error);
    return NextResponse.json({ success: false, message: 'Error fetching followers' }, { status: 500 });
  }
}
