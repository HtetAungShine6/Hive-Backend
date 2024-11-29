import Relationship from '@/models/Relationship';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params; // ID of the user whose following list we want to fetch

  try {
    const following = await Relationship.find({ follower: id }).populate('following', 'id name profileImageUrl');

    const result = following.map(relationship => ({
      id: relationship.following._id,
      name: relationship.following.name,
      profileImageUrl: relationship.following.profileImageUrl,
    }));

    return NextResponse.json({ success: true, following: result }, { status: 200 });
  } catch (error) {
    console.error('Error fetching following:', error);
    return NextResponse.json({ success: false, message: 'Error fetching following' }, { status: 500 });
  }
}
