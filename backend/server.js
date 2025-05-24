const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');

const app = express();
app.use('/uploaded_document', express.static(path.join(__dirname, 'uploaded_document')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true
  }));

  // Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const routes = require('./routes');
app.use('/api', routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));