const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Assuming email should be unique
  },
  phone: {
    type: String,
  },
  resume: {
    // You might store the file path or use a different strategy for files
    type: String,
  },
  feedback: [
    {
      comment: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  // Add other fields as needed (e.g., status, notes)
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Candidate', CandidateSchema);