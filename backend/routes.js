const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const { 
  ManufacturerProfile, 
  ProfileTrack, 
  Notification,
  Product,
  Request,
  Message,
  ManuNotification,
  Revenue 
} = require('./schemas');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');


const app = express();
app.use('/uploaded_document', express.static(path.join(__dirname, 'uploaded_document')));

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
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
});
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const CLIENT_ID = process.env.COGNITO_CLIENT_ID;

// storage configuration for document upload
const FRONTEND_UPLOAD_DIR = path.join(__dirname, '../frontend/public/uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const username = req.body.username || 'default_user';
    const isOther = file.fieldname === 'other_documents';

    const uploadPath = path.join(FRONTEND_UPLOAD_DIR, username, isOther ? 'other_documents' : '');

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const label = file.originalname.split('.')[0].replace(/\s+/g, '_');
    const ext = path.extname(file.originalname);
    const timestamp = Date.now();
    cb(null, `${file.fieldname}_${label}_${timestamp}${ext}`);
  }
});

const upload = multer({ storage });

const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const folder = req.query.folder || "general";
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, `${folder}/${filename}`);
    },
    s3Client: s3, // Add this line
  }),
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'files') {
      cb(null, true);
    } else {
      cb(new Error('Unexpected field'));
    }
  }
});


// Registration Endpoint
app.post('/auth/register', async (req, res) => {
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
app.post('/auth/verify', async (req, res) => {
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
app.post('/auth/resend-otp', async (req, res) => {
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

app.post('/auth/login', async (req, res) => {
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

app.get('/auth/userinfo', async (req, res) => {
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

app.post("/forgot-password", async (req, res) => {
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

app.get("/profile", async (req, res) => {
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

app.get("/getManufacturerProfile", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const manufacturerProfile = await ManufacturerProfile.findOne({ email });
  if(manufacturerProfile.is_verified){
    res.json({ message: "Manufacturer profile found and verified" , data: manufacturerProfile.toObject() || {} , is_verified: true , status: 200 });
  } else {
    res.json({ message: "Manufacturer profile found but not verified" , data: manufacturerProfile.toObject() || {} , is_verified: false , status: 300 });
  }
});

app.post('/upload', upload.fields([
  { name: 'gst_certificate', maxCount: 1 },
  { name: 'pan_card', maxCount: 1 },
  { name: 'incorporation_certificate', maxCount: 1 },
  { name: 'other_documents', maxCount: 10 }
]), (req, res) => {
  const fileUrls = {};

  Object.keys(req.files).forEach(field => {
    fileUrls[field] = req.files[field].map(file => {
      const relativePath = `/uploads/${req.body.username}/${field === 'other_documents' ? 'other_documents/' : ''}${file.filename}`;
      return relativePath;
    });
  });

  res.status(200).json({ uploaded: fileUrls });
});

app.post('/create-profile', async (req, res) => {
  let profile = null;

  try {
    // 1. Save profile to DB
    profile = new ManufacturerProfile(req.body.updatedForm);
    await profile.save();

    // 2. Ensure ProfileTrack exists
    const trackExists = await ProfileTrack.findOne();
    if (!trackExists) {
      await ProfileTrack.create({});
    }

    // 3. Update tracking stats
    const updateResult = await ProfileTrack.updateOne(
      {},
      {
        $inc: {
          totalProfileRequest: 1,
          totalPending: 1
        }
      }
    );

    // Check if the update actually modified any document
    if (updateResult.modifiedCount === 0 && updateResult.matchedCount === 0) {
      throw new Error('Failed to update ProfileTrack');
    }

    res.status(200).json({ message: 'Profile created successfully.' });

  } catch (error) {
    console.error('Error creating profile:', error.message);

    // Cleanup Step 1: Delete profile from DB if it was saved
    if (profile && profile._id) {
      try {
        await ManufacturerProfile.findByIdAndDelete(profile._id);
        console.log('Rolled back saved profile.');
      } catch (deleteErr) {
        console.error('Failed to delete saved profile:', deleteErr.message);
      }
    }

    // Cleanup Step 2: Delete uploaded files (if any)
    const username = req.body.username || 'default_user';
    const uploadDir = path.join(__dirname, '../frontend/public/uploads', username);
    
    try {
      if (fs.existsSync(uploadDir)) {
        fs.rmSync(uploadDir, { recursive: true, force: true });
        console.log('Deleted uploaded files.');
      }
    } catch (fileErr) {
      console.error('Failed to delete uploaded files:', fileErr.message);
    }

    res.status(500).json({ error: 'Failed to create profile. Changes have been rolled back.' });
  }
});

app.get("/getProfile", async (req, res) => {
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

app.get("/admin/profiles", async (req, res) => {
  try {
    const manufacturerProfiles = await ManufacturerProfile.find();
    res.json({ message: "Manufacturer profiles fetched successfully", data: manufacturerProfiles, status: 200 });
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});

app.post("/admin/approveProfile", async (req, res) => {
  try {
    const profileId = req.body.profileId;
    const manufacturerProfile = await ManufacturerProfile.findById(profileId);
    if (manufacturerProfile) {
      manufacturerProfile.status = "approved";
      manufacturerProfile.is_verified = true;
      await manufacturerProfile.save();
      await Notification.create({
        userId: manufacturerProfile.email,
        title: 'Profile Approved',
        message: 'Congratulations! Your profile is approved. You can now post products.',
        type: 'approval'
      });
      res.json({ message: "Manufacturer profile approved successfully", status: 200 });
    } else {
      res.json({ message: "Manufacturer profile not found", status: 404 });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});

app.post("/admin/rejectProfile", async (req, res) => {
  try {
    const profileId = req.body.profileId;
    const reason = req.body.reason;
    const manufacturerProfile = await ManufacturerProfile.findById(profileId);
    if (manufacturerProfile) {
      manufacturerProfile.status = "rejected";
      await manufacturerProfile.save();
      await Notification.create({
        userId: manufacturerProfile.email,
        title: 'Profile Rejected',
        message: `Your profile was rejected. Reason: ${reason}`,
        type: 'rejection'
      });
      res.json({ message: "Manufacturer profile rejected successfully", status: 200 });
    } else {
      res.json({ message: "Manufacturer profile not found", status: 404 });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});

app.get("/notifications/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const notifications = await Notification.find({ userId: userId });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});

app.put("/notifications/read/:notificationId", async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    const notification = await Notification.findById(notificationId);
    if (notification) {
      notification.read = true;
      await notification.save();
      res.json({ message: "Notification marked as read successfully", status: 200 });
    } else {
      res.json({ message: "Notification not found", status: 404 });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});

app.get("/notifications/unread/count/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const notifications = await Notification.find({ userId: userId, read: false });
    res.json({ count: notifications.length });
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});

// manufacturer dashboard routes
app.get("/manufacturerProfile", async (req, res) => {
  try {
    const email = req.query.email;
    const manufacturerProfile = await ManufacturerProfile.findOne({ email: email });
    if (manufacturerProfile.is_verified) {
      res.json({ message: "Manufacturer profile already exists", data: manufacturerProfile, status: 200 });
    } else {
      res.json({ message: "Manufacturer profile does not exist", status: 404 });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});

app.get("/requests", async (req, res) => {
  try {
    const email = req.query.email;
    const requests = await Request.find({ email: email });
    res.json({ message: "Requests fetched successfully", data: requests, status: 200 });
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});

app.get("/messages", async (req, res) => {
  try {
    const email = req.query.email;
    const messages = await Message.find({ email: email });
    res.json({ message: "Messages fetched successfully", data: messages, status: 200 });
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});

app.get("/notifications", async (req, res) => {
  try {
    const email = req.query.email;
    const notifications = await ManuNotification.find({ userId: email });
    res.json({ message: "Notifications fetched successfully", data: notifications, status: 200 });
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});

app.get("/dashboard/stats", async (req, res) => {
  try {
    const email = req.query.email;

    // Parallel DB queries
    const [products, requests, messages, notifications] = await Promise.all([
      Product.find({ email }),
      Request.find({ receiverId: email }),
      Message.find({ receiverId: email }),
      ManuNotification.find({ userId: email }),
    ]);

    const stats = {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.status === "active").length,
      pendingRequests: requests.filter(r => r.status === "pending").length,
      newInquiries: messages.filter(m => !m.isRead).length,
      unreadNotifications: notifications.filter(n => !n.isRead).length,
      totalRevenue: products.reduce((sum, p) => sum + parseFloat(p.price?.toString() || "0") * (p.stock || 0), 0),
      lowStockProducts: products.filter(p => (p.stock || 0) < 5).length,
    };

    res.json({message: "Dashboard stats fetched successfully", data: stats, status: 200});
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Failed to get dashboard stats" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const email = req.query.email;
    const products = await Product.find({ manufacturerId: email });
    res.json({ message: "Products fetched successfully", data: products, status: 200 });
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});

app.post("/upload-media", uploadS3.array("files", 10), (req, res) => {
  try {
    console.log("Received upload request");
    console.log("Files:", req.files);

    const folder = req.body.folder || "general";

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    console.log(`Uploaded ${req.files.length} files to folder: ${folder}`);

    const urls = req.files.map((file) => file.location);
    res.status(200).json({
      message: "Media uploaded successfully",
      uploaded: urls,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      message: error.message || "Something went wrong",
    });
  }
});

app.post("/add-product", async (req, res) => {
  console.log("incoming data", req.body);
  try {
    const {
      manufacturerEmail,
      title,
      description,
      category,
      price,
      minOrderQuantity,
      stock,
      images,
      videos,
      specifications,
      status,
      pricingTiers,
      variants,
      dimensions,
      materials,
      certifications,
      warranty,
      leadTime,
      customizable,
      tags,
    } = req.body;

    // Validate required fields
    if (
      typeof manufacturerEmail === "undefined" ||
      typeof title === "undefined" ||
      typeof category === "undefined" ||
      typeof price === "undefined"
    ) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Create product object
    const product = new Product({
      manufacturerEmail,
      title,
      description,
      category,
      price,
      minOrderQuantity,
      stock,
      images,
      videos,
      specifications,
      status,
      pricingTiers: typeof pricingTiers === "string" ? JSON.parse(pricingTiers) : pricingTiers,
      variants: typeof variants === "string" ? JSON.parse(variants) : variants,
      dimensions: typeof dimensions === "string" ? JSON.parse(dimensions) : dimensions,
      materials,
      certifications,
      warranty,
      leadTime,
      customizable,
      tags,
    });

    const savedProduct = await product.save();
    return res.status(201).json({ message: "Product created", product: savedProduct });
  } catch (error) {
    console.error("Error saving product:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});



module.exports = app;