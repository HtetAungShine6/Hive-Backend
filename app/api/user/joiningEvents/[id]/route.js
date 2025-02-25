// import { NextResponse } from 'next/server'
// import Event from '../../../../../models/Event'
// import User from '../../../../../models/User'

// // Helper functions for formatting date and time
// const formatDate = (date) => (date ? date.toISOString().split('T')[0] : null)
// const formatTime = (date) =>
//   date
//     ? date.toISOString().split('T')[1].split(':').slice(0, 2).join(':')
//     : null

// export async function GET(req, { params }) {
//   const { id } = params

//   try {
//     // Fetch events the user has joined
//     const joiningEvents = await Event.find({ 'participants._id': id })

//     // Format events and retrieve organizer details
//     const formattedEvents = await Promise.all(
//       joiningEvents.map(async (event) => {
//         let organizerDetails = null
//         if (event.organizer) {
//           const organizer = await User.findById(event.organizer)
//           if (organizer) {
//             organizerDetails = {
//               _id: organizer._id,
//               name: organizer.name,
//               profileImageUrl: organizer.profileImageUrl,
//               instagramLink: organizer.instagramLink,
//               verificationStatus: organizer.verificationStatus,
//               bio: organizer.bio,
//               about: organizer.about,
//             }
//           }
//         }

//         return {
//           ...event.toObject(),
//           startDate: formatDate(new Date(event.startDate)),
//           endDate: formatDate(new Date(event.endDate)),
//           startTime: formatTime(new Date(event.startDate)),
//           endTime: formatTime(new Date(event.endDate)),
//           organizer: organizerDetails,
//         }
//       })
//     )

//     return NextResponse.json(
//       {
//         success: true,
//         message: formattedEvents,
//       },
//       { status: 200 }
//     )
//   } catch (error) {
//     console.error('Error retrieving joined events:', error)
//     return NextResponse.json(
//       { success: false, message: 'Error retrieving events' },
//       { status: 500 }
//     )
//   }
// }

import { NextResponse } from 'next/server'
import Event from '../../../../../models/Event'

// Helper functions for formatting date and time
const formatDate = (date) => (date ? date.toISOString().split('T')[0] : null)
const formatTime = (date) =>
  date
    ? date.toISOString().split('T')[1].split(':').slice(0, 2).join(':')
    : null

export async function GET(req, { params }) {
  const { id } = params

  try {
    // Fetch events the user has joined and populate participants + organizer in one query
    const joiningEvents = await Event.find({ 'participants._id': id })
    .populate({
      path: 'participants._id',
      select: 'name profileImageUrl instagramLink verificationStatus bio about',
    })
    .populate({
      path: 'organizer',
      select: 'name profileImageUrl instagramLink verificationStatus bio about',
    })

    // Format events
    const formattedEvents = joiningEvents.map(event => ({
      ...event.toObject(),
      startDate: formatDate(event.startDate),
      endDate: formatDate(event.endDate),
      startTime: formatTime(event.startDate),
      endTime: formatTime(event.endDate),
    }))

    return NextResponse.json(
      { success: true, message: formattedEvents },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error retrieving joined events:', error)
    return NextResponse.json(
      { success: false, message: 'Error retrieving events' },
      { status: 500 }
    )
  }
}