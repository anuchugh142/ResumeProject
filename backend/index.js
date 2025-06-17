require('dotenv').config();
console.log('MongoDB URI from process.env:', process.env.MONGODB_URI);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: ['https://precious-axolotl-38d7b0.netlify.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_PATH || 'uploads')));

// Database connection 
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  bufferCommands: false
})
.then(() => {
  console.log('MongoDB Connected');

  // Define a simple route
  app.get('/', (req, res) => {
    res.send('Backend server is running!');
  });

  // Use Routes
  app.use('/api/candidates', require('./routes/api/candidates'));

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: 'Server Error', error: err.message || 'Something broke!' });
  });

  // For local development
  if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }

})
.catch(err => console.log('MongoDB Connection Error:', err));

// Export the Express API
module.exports = app;