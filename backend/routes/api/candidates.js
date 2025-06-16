const express = require('express');
const router = express.Router();
const multer = require('multer');
const Candidate = require('../../models/Candidate'); // Import the Candidate model

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

// @route   GET api/candidates
// @desc    Get all candidates
// @access  Public (for now)
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ date: -1 }); // Get candidates, sorted by date
    res.json(candidates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/candidates
// @desc    Add a new candidate
// @access  Public (for now)
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const resumePath = req.file ? req.file.path : null;
    
    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ msg: 'Name and email are required' });
    }

    const newCandidate = new Candidate({
      name,
      email,
      phone,
      resume: resumePath
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
    res.status(500).send('Server Error');
  }
});


module.exports = router;