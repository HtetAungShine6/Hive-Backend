import Relationship from '@/models/Relationship';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Helper function to verify token
const verifyToken = (req) => {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return null;
  }
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
};

// Unfollow a user
export async function DELETE(req, { params }) {
  const decoded = verifyToken(req);
  if (!decoded) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const userId = decoded.id; 
  const followedId = params.id; 

  try {
    // Remove follow relationship
    const result = await Relationship.findOneAndDelete({ follower: userId, following: followedId });

    if (!result) {
      return NextResponse.json({ success: false, message: 'Not following this user' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Unfollowed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return NextResponse.json({ success: false, message: 'Error unfollowing user' }, { status: 500 });
  }
}
