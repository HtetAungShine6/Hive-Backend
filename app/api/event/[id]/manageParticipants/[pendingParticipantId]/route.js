import Event from '@/models/Event';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const secret = process.env.JWT_SECRET;

const verifyToken = (req) => {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return false;
  }
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return false;
  }
};

export async function POST(req, { params }) {
  const decoded = verifyToken(req);
  if (!decoded) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const organizerId = decoded.id;
  const { id: eventId, pendingParticipantId } = params; // Extract both IDs
  const { action } = await req.json();

  if (!['approve', 'reject'].includes(action)) {
    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
    }

    if (event.organizer !== organizerId) {
      return NextResponse.json({
        success: false,
        message: 'Only the organizer can manage participants',
      }, { status: 403 });
    }

    const pendingIndex = event.pendingParticipants.findIndex(
      (participant) => participant.userid === pendingParticipantId
    );

    if (pendingIndex === -1) {
      return NextResponse.json({ success: false, message: 'Pending participant not found' }, { status: 404 });
    }

    if (action === 'approve') {
      // Approve action: move pendingParticipant to participants
      const participant = event.pendingParticipants.splice(pendingIndex, 1)[0];
      event.participants.push(participant);
    } else if (action === 'reject') {
      // Reject action: remove pendingParticipant
      event.pendingParticipants.splice(pendingIndex, 1);
    }

    await event.save();

    return NextResponse.json({
      success: true,
      message: `Participant ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
