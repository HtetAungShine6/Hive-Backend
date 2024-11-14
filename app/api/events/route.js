import Event from '@/models/Event';
import ExpiredEvent from '@/models/ExpiredEvent';
import User from '@/models/User';
import { NextResponse } from 'next/server';

// Function to move expired events to the ExpiredEvent collection
async function moveExpiredEvent(eventData) {
  const expiredEvent = new ExpiredEvent(eventData);
  await expiredEvent.save();
}

export async function GET(req) {
  try {
    const events = await Event.find();
    const today = new Date(); 

    // Separate expired and active events
    const expiredEvents = events.filter(event => {
      const endDate = new Date(event.endDate); 
      const isExpired = endDate < today; 
      return isExpired;
    });

    const activeEvents = events.filter(event => new Date(event.endDate) >= today);

    // Move expired events to ExpiredEvent collection and delete from Event collection
    for (const expiredEvent of expiredEvents) {
      // Move to ExpiredEvent
      await moveExpiredEvent(expiredEvent.toObject());

      // Delete from Event collection
      if (expiredEvent._id) {
        const deletionResult = await Event.findByIdAndDelete(expiredEvent._id);
      } else {
        return NextResponse.json({ success: false, message: 'Error moving expired event' }, { status: 500 });
      }
    }

    // Format active events for response
    const formattedEvents = await Promise.all(
      activeEvents.map(async event => {
        const formattedStartDate = event.startDate?.toISOString().split('T')[0] ?? null;
        const formattedEndDate = event.endDate?.toISOString().split('T')[0] ?? null;
        const formattedStartTime = event.startTime?.toISOString().split('T')[1].slice(0, 5) ?? null;
        const formattedEndTime = event.endTime?.toISOString().split('T')[1].slice(0, 5) ?? null;

        // Update participant and organizer details
        const updatedParticipants = await Promise.all(
          event.participants.map(async participant => {
            const user = await User.findById(participant.userid)
            if (user) {
              // Use the updated user data
              return {
                userid: user._id,
                name: user.name,
                profileImageUrl: user.profileImageUrl,
                instagramLink: user.instagramLink,
                bio: user.bio,
              }
            }
            // If user not found, return the existing participant data
            return participant
          })
        )

        const organizer = await User.findById(event.organizer);
        const organizerDetails = organizer ? {
          userid: organizer._id,
          name: organizer.name,
          profileImageUrl: organizer.profileImageUrl,
          instagramLink: organizer.instagramLink,
          bio: organizer.bio,
        } : event.organizer;

        return {
          ...event.toObject(),
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          startTime: formattedStartTime,
          endTime: formattedEndTime,
          participants: updatedParticipants,
          organizer: organizerDetails,
        };
      })
    );

    // Return only active events in the response
    return NextResponse.json({ success: true, message: formattedEvents }, { status: 200 });
  } catch (err) {
    console.error('Error fetching events:', err); // Log error
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
