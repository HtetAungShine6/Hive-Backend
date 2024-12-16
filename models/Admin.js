import mongoose from 'mongoose'

// User Schema
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})

// Create Admin model
const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema)

export default Admin
