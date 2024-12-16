import mongoose from 'mongoose';

// Relationship Schema
const relationshipSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create Relationship model
const Relationship = mongoose.models.Relationship || mongoose.model('Relationship', relationshipSchema);

export default Relationship;
