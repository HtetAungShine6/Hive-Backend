import mongoose from 'mongoose'

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    trim: true,
  },
  profileImageUrl: {
    type: String,
    default: '',
  },
  about: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  instagramLink: {
    type: String,
    default: '',
  },
  isOrganizer: {
    type: Boolean,
    default: false,
  },
  isSuspened: {
    type: Boolean,
    default: false,
  },
  verificationImageUrl: {
    type: String,
    default: '',
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'notVerified'],
    default: 'notVerified',
  },
  password: {
    type: String,
    required: true,
  },
})

// Create User model
const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User
