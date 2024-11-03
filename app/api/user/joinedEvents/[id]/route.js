import { NextResponse } from 'next/server';
import ExpiredEvent from '@/models/ExpiredEvent';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

const verifyToken = (req) => {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return null;
  }
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    console.error('JWT verification error:', err);
    return null;
  }
};

export async function GET(req, { params }) {
  const { id } = params; 
  const decoded = verifyToken(req);

  if (!decoded) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  if (decoded.id !== id) {
    return NextResponse.json({ success: false, message: 'Forbidden: ID mismatch' }, { status: 403 });
  }

  try {
    const joinedEvents = await ExpiredEvent.find({ 'participants.userid': id });

    return NextResponse.json({
      success: true,
      message: joinedEvents,
    }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving joined events:', error);
    return NextResponse.json({ success: false, message: 'Error retrieving events' }, { status: 500 });
  }
}
