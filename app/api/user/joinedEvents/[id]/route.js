// import { NextResponse } from 'next/server'
// import ExpiredEvent from '../../../../../models/ExpiredEvent'
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
//     // Fetch joined events
//     const joinedEvents = await ExpiredEvent.find({ 'participants._id': id })

//     // Format events and retrieve organizer details
//     const formattedEvents = await Promise.all(
//       joinedEvents.map(async (event) => {
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
import ExpiredEvent from '../../../../../models/ExpiredEvent'
import User from '../../../../../models/User'

// Helper functions for formatting date and time
const formatDate = (date) => (date ? date.toISOString().split('T')[0] : null)
const formatTime = (date) =>
  date
    ? date.toISOString().split('T')[1].split(':').slice(0, 2).join(':')
    : null

export async function GET(req, { params }) {
  const { id } = params

  try {
    // Fetch events the user has joined
    const joinedEvents = await ExpiredEvent.find({ 'participants._id': id })

    // Format events, retrieve organizer and participants' details
    const formattedEvents = await Promise.all(
      joinedEvents.map(async (event) => {
        // Fetch organizer details
        let organizerDetails = null
        if (event.organizer) {
          const organizer = await User.findById(event.organizer).select(
            'name profileImageUrl instagramLink verificationStatus bio about'
          )
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
          startDate: formatDate(new Date(event.startDate)),
          endDate: formatDate(new Date(event.endDate)),
          startTime: formatTime(new Date(event.startDate)),
          endTime: formatTime(new Date(event.endDate)),
          organizer: organizerDetails,
          participants: participantsDetails.filter((p) => p !== null), 
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
    console.error('Error retrieving joined events:', error)
    return NextResponse.json(
      { success: false, message: 'Error retrieving events' },
      { status: 500 }
    )
  }
}