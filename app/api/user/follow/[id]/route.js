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

// Follow a user
export async function POST(req, { params }) {
  const decoded = verifyToken(req);
  if (!decoded) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const userId = decoded.id; 
  const followedId = params.id; 

  if (userId === followedId) {
    return NextResponse.json({ success: false, message: "You can't follow yourself" }, { status: 400 });
  }

  try {
    const existingRelationship = await Relationship.findOne({ follower: userId, following: followedId });
    if (existingRelationship) {
      return NextResponse.json({ success: false, message: 'Already following this user' }, { status: 400 });
    }

    const relationship = new Relationship({ follower: userId, following: followedId });
    await relationship.save();

    return NextResponse.json({ success: true, message: 'Followed successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error following user:', error);
    return NextResponse.json({ success: false, message: 'Error following user' }, { status: 500 });
  }
}
