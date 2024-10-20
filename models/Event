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
    default: 0,
  },
  isLimited: {
    type: Boolean,
    default: false,
  },
  category: {
    type: Array,
    required: true,
  },
  additionalInfo: {
    type: String,
    default: '',
  },
  participants: {
    type: Array,
    default: [],
  },
  organizer: {
    type: String,
    required: true,
  },
})

// Create Event model
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema)

export default Event
