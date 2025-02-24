// import { NextResponse } from 'next/server'
// import ExpiredEvent from '../../../../../models/ExpiredEvent'
// import User from '../../../../../models/User'

// // Helper function for formatting date
// const formatDate = (date) => (date ? date.toISOString().split('T')[0] : null)

// // Helper function for formatting time
// const formatTime = (date) =>
//   date
//     ? date.toISOString().split('T')[1].split(':')[0] +
//       ':' +
//       date.toISOString().split('T')[1].split(':')[1]
//     : null

// export async function GET(req, { params }) {
//   const { id } = params

//   try {
//     // Find events organized by the user
//     const organizedEvents = await ExpiredEvent.find({ organizer: id })

//     // Format event details and get organizer info
//     const formattedEvents = await Promise.all(
//       organizedEvents.map(async (event) => {
//         let organizerDetails = null

//         // Fetch organizer details
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

//         // Format event data
//         return {
//           ...event.toObject(),
//           startDate: formatDate(event.startDate),
//           endDate: formatDate(event.endDate),
//           startTime: formatTime(event.startDate),
//           endTime: formatTime(event.endDate),
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
//     console.error('Error retrieving organized events:', error)
//     return NextResponse.json(
//       {
//         success: false,
//         message: 'Error retrieving events',
//       },
//       { status: 500 }
//     )
//   }
// }


import { NextResponse } from 'next/server'
import ExpiredEvent from '../../../../../models/ExpiredEvent'
import User from '../../../../../models/User'

// Helper function for formatting date
const formatDate = (date) => (date ? date.toISOString().split('T')[0] : null)

// Helper function for formatting time
const formatTime = (date) =>
  date
    ? date.toISOString().split('T')[1].split(':')[0] +
      ':' +
      date.toISOString().split('T')[1].split(':')[1]
    : null

export async function GET(req, { params }) {
  const { id } = params

  try {
    // Find events organized by the user
    const organizingEvents = await ExpiredEvent.find({ organizer: id })

    // Format event details and get organizer and participants info
    const formattedEvents = await Promise.all(
      organizingEvents.map(async (event) => {
        let organizerDetails = null

        // Fetch organizer details
        if (event.organizer) {
          const organizer = await User.findById(event.organizer)
          if (organizer) {
            organizerDetails = {
              _id: organizer._id,
              name: organizer.name,
              profileImageUrl: organizer.profileImageUrl,
              instagramLink: organizer.instagramLink,
              verificationStatus: organizer.verificationStatus,
              bio: organizer.bio,
              about: organizer.about,
            }
          }
        }

        // Fetch participants' details
        const participantsDetails = await Promise.all(
          event.participants.map(async (participant) => {
            const participantDetails = await User.findById(participant._id).select(
              'name profileImageUrl instagramLink verificationStatus bio about'
            )
            if (participantDetails) {
              return {
                _id: participantDetails._id,
                name: participantDetails.name,
                profileImageUrl: participantDetails.profileImageUrl,
                instagramLink: participantDetails.instagramLink,
                verificationStatus: participantDetails.verificationStatus,
                bio: participantDetails.bio,
                about: participantDetails.about,
              }
            }
            return null
          })
        )

        const pendingParticipantsDetails = await Promise.all(
          event.pendingParticipants.map(async (pendingParticipant) => {
            const pendingParticipantDetails = await User.findById(pendingParticipant._id).select(
              'name profileImageUrl instagramLink verificationStatus bio about'
            )
            if (pendingParticipantDetails) {
              return {
                _id: pendingParticipantDetails._id,
                name: pendingParticipantDetails.name,
                profileImageUrl: pendingParticipantDetails.profileImageUrl,
                instagramLink: pendingParticipantDetails.instagramLink,
                verificationStatus: pendingParticipantDetails.verificationStatus,
                bio: pendingParticipantDetails.bio,
                about: pendingParticipantDetails.about,
              }
            }
            return null
          })
        )

        return {
          ...event.toObject(),
          startDate: formatDate(event.startDate),
          endDate: formatDate(event.endDate),
          startTime: formatTime(event.startDate),
          endTime: formatTime(event.endDate),
          organizer: organizerDetails,
          participants: participantsDetails.filter((p) => p !== null), // Ensure no null values
          pendingParticipants: pendingParticipantsDetails.filter((p) => p !== null),
        }
      })
    )

    return NextResponse.json(
      {
        success: true,
        message: formattedEvents,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error retrieving organized events:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error retrieving events',
      },
      { status: 500 }
    )
  }
}