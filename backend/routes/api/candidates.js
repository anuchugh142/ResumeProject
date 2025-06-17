const express = require('express');
const router = express.Router();
const multer = require('multer');
const Candidate = require('../../models/Candidate'); // Import the Candidate model
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for file upload
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'resumes', // Cloudinary folder name
    allowed_formats: ['pdf'],
    resource_type: 'raw', // Change from 'auto' to 'raw' for non-image files like PDFs
    format: 'pdf', // Explicitly set format to pdf
  },
});

const upload = multer({ storage: storage });

// @route   GET api/candidates
// @desc    Get all candidates
// @access  Public (for now)
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ date: -1 }); // Get candidates, sorted by date
    res.json(candidates);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST api/candidates
// @desc    Add a new candidate
// @access  Public (for now)
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const resumeUrl = req.file ? (req.file.path.endsWith('.pdf') ? req.file.path : req.file.path + '.pdf') : null; // Cloudinary returns the URL in .path

    if (!name || !email) {
      return res.status(400).json({ msg: 'Name and email are required' });
    }

    const newCandidate = new Candidate({
      name,
      email,
      phone,
      resume: resumeUrl,
    });

    const candidate = await newCandidate.save();
    res.json(candidate);
  } catch (err) {
    console.error('Error saving candidate:', err);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Email already exists' });
    }
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// Add routes for GET single candidate, PUT (update), DELETE as needed
// Example: GET single candidate by ID
router.get('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }
    res.json(candidate);
  } catch (err) {
    console.error(err.message);
    // Handle case where ID format is invalid
    if (err.kind === 'ObjectId') {
         return res.status(404).json({ msg: 'Candidate not found' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST api/candidates/:id/feedback
// @desc    Add feedback to a candidate
// @access  Public (for now)
router.post('/:id/feedback', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }

    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ msg: 'Feedback comment is required' });
    }

    const newFeedback = {
      comment,
    };

    candidate.feedback.unshift(newFeedback); // Add new feedback to the beginning of the array

    await candidate.save();

    res.json(candidate.feedback);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;