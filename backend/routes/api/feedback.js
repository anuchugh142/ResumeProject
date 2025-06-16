const express = require('express');
const router = express.Router();
const Feedback = require('../../models/Feedback');
const Candidate = require('../../models/Candidate');

// @route   POST api/feedback/:candidateId
// @desc    Add feedback for a candidate
// @access  Public
router.post('/:candidateId', async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const candidateId = req.params.candidateId;

    // Check if candidate exists
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ msg: 'Rating must be between 1 and 5' });
    }

    const newFeedback = new Feedback({
      candidate: candidateId,
      comment,
      rating
    });

    const feedback = await newFeedback.save();
    res.json(feedback);
  } catch (err) {
    console.error('Error saving feedback:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// @route   GET api/feedback/:candidateId
// @desc    Get all feedback for a candidate
// @access  Public
router.get('/:candidateId', async (req, res) => {
  try {
    const candidateId = req.params.candidateId;

    // Check if candidate exists
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }

    const feedback = await Feedback.find({ candidate: candidateId })
      .sort({ date: -1 });
    
    res.json(feedback);
  } catch (err) {
    console.error('Error fetching feedback:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// @route   DELETE api/feedback/:id
// @desc    Delete a feedback
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ msg: 'Feedback not found' });
    }

    await feedback.deleteOne();
    res.json({ msg: 'Feedback removed' });
  } catch (err) {
    console.error('Error deleting feedback:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

module.exports = router; 