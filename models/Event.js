import mongoose from 'mongoose'

// Event Schema
const eventSchema = new mongoose.Schema({
  eventImageUrl: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  maxParticipants: {
    type: Number,
    default: 20,
  },
  minAge: {
    type: Number,
    default: 0,
  },
  category: {
    type: Array,
    required: true,
  },
  additionalInfo: {
    type: String,
    default: '',
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  participants: {
    type: Array,
    default: [],
  },
  organizer: {
    type: String,
    required: true,
  },
  pendingParticipants: {
    type: Array,
    default: [],
  },
})

// Create Event model
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema)

export default Event
