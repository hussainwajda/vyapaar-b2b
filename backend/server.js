const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
require('dotenv').config();
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

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

// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

const generateSecretHash = (username, clientId, clientSecret) => {
    return crypto
      .createHmac('SHA256', clientSecret)
      .update(username + clientId)
      .digest('base64');
  };

const cognito = new AWS.CognitoIdentityServiceProvider();
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const CLIENT_ID = process.env.COGNITO_CLIENT_ID;

// storage configuration for document upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const username = req.body.username || 'default_user';
    const isOther = file.fieldname === 'other_documents';
    const basePath = path.join(__dirname, 'uploaded_document', username, isOther ? 'other_documents' : '');
    
    fs.mkdirSync(basePath, { recursive: true });
    cb(null, basePath);
  },
  filename: function (req, file, cb) {
    const label = file.originalname.split('.')[0].replace(/\s+/g, '_');
    const ext = path.extname(file.originalname);
    const timestamp = Date.now();
    cb(null, `${file.fieldname}_${label}_${timestamp}${ext}`);
  }
});

const upload = multer({ storage });

// Schema
const manufacturerProfileSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Manufacturer/Business Name
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  role: { type: String, default: "manufacturer" }, // default helps if this is fixed
  company_type: { type: String, enum: ['Proprietorship', 'Partnership', 'Pvt Ltd', 'LLP', 'Public Ltd'], required: true },

  categories: [String], // Types of products manufactured

  GST_no: { type: String, required: true, unique: true },
  PAN_no: { type: String, required: true, unique: true },

  address: {
    line1: { type: String },
    line2: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
  },


  year_of_establishment: Number,
  website: String,
  logo_url: String, // Optional branding

  certifications: [String],
  documents: {
    gst_certificate: String,
    pan_card: String,
    incorporation_certificate: String,
    others: [String],
  },

  contact_person: {
    name: String,
    designation: String,
    email: String,
    phone: String,
  },

  is_verified: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

const ManufacturerProfile = mongoose.model('ManufacturerProfile', manufacturerProfileSchema);

// Registration Endpoint
app.post('/api/auth/register', async (req, res) => {
  const { username, password, email, phone, role, categories } = req.body;

  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: username,
    Password: password,
    SecretHash: generateSecretHash(
      username,
      process.env.COGNITO_CLIENT_ID,
      process.env.COGNITO_CLIENT_SECRET
    ),
    UserAttributes: [
      { Name: 'email', Value: email },
      { Name: 'phone_number', Value: phone },
      { Name: 'custom:role', Value: role },
      { Name: 'custom:categories', Value: categories.join(',') }
    ]
  };

  try {
    const response = await cognito.signUp(params).promise();
    res.status(200).json({ 
      message: 'Registration successful. Please check your OTP.',
      data: response 
    });
    } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ 
      message: error.message,
      code: error.code 
    });
  }
});

// OTP Verification Endpoint
app.post('/api/auth/verify', async (req, res) => {
  const { username, code } = req.body;

  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: req.body.username,
    ConfirmationCode: req.body.code,
    SecretHash: generateSecretHash(
      req.body.username,
      process.env.COGNITO_CLIENT_ID,
      process.env.COGNITO_CLIENT_SECRET
    )
  };
  try {
    const response = await cognito.confirmSignUp(params).promise();
    console.log('Account verified successfully', response);
    res.json({ 
      message: 'Account verified successfully',
      data: response 
    });
    } catch (error) {
    console.error('Verification error:', error);
    res.status(400).json({ 
      message: error.message,
      code: error.code 
    });
  }
});

// Resend OTP Endpoint
app.post('/api/auth/resend-otp', async (req, res) => {
  const { username, method } = req.body;

  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: req.body.username,
    SecretHash: generateSecretHash(
      req.body.username,
      process.env.COGNITO_CLIENT_ID,
      process.env.COGNITO_CLIENT_SECRET
    )
  };

  try {
    await cognito.resendConfirmationCode(params).promise();
    res.json({ message: `OTP resent via ${method}` });
  } catch (error) {
    console.error('Resend error:', error);
    res.status(400).json({ 
      message: error.message,
      code: error.code 
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        ...(process.env.COGNITO_CLIENT_SECRET && {
          SECRET_HASH: generateSecretHash(
            username,
            process.env.COGNITO_CLIENT_ID,  // Add this
            process.env.COGNITO_CLIENT_SECRET  // Add this
          )
        })
      }
    };

    // Rest of the code remains the same
    const response = await cognito.initiateAuth(params).promise();
    
    res.json({
      accessToken: response.AuthenticationResult.AccessToken,
      refreshToken: response.AuthenticationResult.RefreshToken,
      idToken: response.AuthenticationResult.IdToken,
      expiresIn: response.AuthenticationResult.ExpiresIn
    });

  } catch (error) {
    console.error('Login error:', error);
    
    // Handle common Cognito errors
    let message = 'Login failed';
    if (error.code === 'NotAuthorizedException') {
      message = 'Invalid credentials';
    } else if (error.code === 'UserNotConfirmedException') {
      message = 'User not confirmed';
    }
    
    res.status(400).json({ error: message });
  }
});

app.get('/api/auth/userinfo', async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1]; // Extract Access Token

    if (!accessToken) {
      return res.status(401).json({ error: "Access Token is required" });
    }

    const params = { AccessToken: accessToken };

    const response = await cognito.getUser(params).promise();
    res.json(response);
  } catch (error) {
    console.error('User info error:', error);
    res.status(400).json({ error: 'Failed to fetch user info' });
  }
});

app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const params = {
      ClientId: CLIENT_ID,
      Username: email,
    };
    
    await cognito.forgotPassword(params).promise();
    res.json({ message: "Password reset code sent to your email" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});

app.get("/api/profile", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const manufacturerProfile = await ManufacturerProfile.findOne({ email });
    if (manufacturerProfile) {
      res.json({ message: "Manufacturer profile already exists" });
    } else {
      res.json({ message: "Manufacturer profile does not exist" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});

app.post('/api/upload', upload.fields([
  { name: 'gst_certificate', maxCount: 1 },
  { name: 'pan_card', maxCount: 1 },
  { name: 'incorporation_certificate', maxCount: 1 },
  { name: 'other_documents', maxCount: 10 } // multiple
]), (req, res) => {
  const fileUrls = {};

  Object.keys(req.files).forEach(field => {
    fileUrls[field] = req.files[field].map(file => {
      const relativePath = `/uploaded_document/${req.body.username}/${field === 'other_documents' ? 'other_documents/' : ''}${file.filename}`;
      return relativePath;
    });
  });

  res.status(200).json({ uploaded: fileUrls });
});

// API route
app.post('/api/create-profile', async (req, res) => {
  try {
    const profile = new ManufacturerProfile(req.body);
    await profile.save();
    res.status(200).json({ message: 'Profile created successfully.' });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ error: 'Failed to create profile.' });
  }
});


app.get("/api/getProfile", async (req, res) => {
  try {
    const email = req.query.email;
    const manufacturerProfile = await ManufacturerProfile.findOne({ email: email });
    if (manufacturerProfile) {
      res.json({ message: "Manufacturer profile already exists", data: manufacturerProfile, status: 200 });
    } else {
      res.json({ message: "Manufacturer profile does not exist", status: 404 });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));