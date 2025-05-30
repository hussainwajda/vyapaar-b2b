const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const Razorpay = require("razorpay");
const { 
  ManufacturerProfile, 
  ProfileTrack, 
  Notification,
  Product,
  QuotationRequest,
  Message,
  ManuNotification,
  Revenue,
  Order,
  Address 
} = require('./schemas');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

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

const getCategoryNamefromID = async (categoryID) => {
  const SAMPLE_CATEGORIES = [
    { id: "1", name: "Electronics & Components", icon: "📱" },
    { id: "2", name: "Apparel & Fashion", icon: "👕" },
    { id: "3", name: "Home & Garden", icon: "🏡" },
    { id: "4", name: "Health & Beauty", icon: "💊" },
    { id: "5", name: "Machinery & Equipment", icon: "🔨" },
    { id: "6", name: "Automotive Parts", icon: "🚗" },
    { id: "7", name: "Construction Materials", icon: "🏗️" },
    { id: "8", name: "Food & Beverages", icon: "🍔" },
    { id: "9", name: "Packaging & Printing", icon: "📦" },
    { id: "10", name: "Sports & Entertainment", icon: "🎮" },
    { id: "11", name: "Textiles & Leather", icon: "👔" },
    { id: "12", name: "Tools & Hardware", icon: "🛠️" },
    { id: "13", name: "Chemical & Plastics", icon: "🧪" },
    { id: "14", name: "Agriculture & Farming", icon: "🌾" },
    { id: "15", name: "Office & School Supplies", icon: "📚" },
  ];
  const category = SAMPLE_CATEGORIES.find((category) => category.id === categoryID);
  return category ? category.name : null;
}

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
    const requests = await QuotationRequest.find({ receiverId: email });
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
      QuotationRequest.find({ receiverId: email }),
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

app.delete("/product/:id", async (req, res) => {
  
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);
    if (product) {
      res.json({ message: "Product deleted successfully", status: 200 });
    } else {
      res.json({ message: "Product not found", status: 404 });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});

app.post("/upload-media", uploadS3.array("files", 10), (req, res) => {
  try {
    console.log("Received upload request");
    console.log("Files:", req.files);

    const folder = req.query.folder || "general";

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    console.log(`Uploaded ${req.files.length} files to folder: ${folder}`);

    // Map all file locations to URLs array
    const urls = req.files.map((file) => file.location);
    
    console.log("Generated URLs:", urls);

    res.status(200).json({
      message: "Media uploaded successfully",
      uploaded: urls, // This should contain all URLs
      count: urls.length // Add count for debugging
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      message: error.message || "Something went wrong",
    });
  }
});

app.post("/add-product", async (req, res) => {
  try {
    const {
      manufacturerEmail,
      title,
      description,
      category,
      subCategory,
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
      category: await getCategoryNamefromID(category),
      subCategory,
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

app.get("/product/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    const convertDecimal = (value) => {
      if (value && typeof value === 'object' && '$numberDecimal' in value) {
        return parseFloat(value.$numberDecimal);
      }
      return value;
    };

    // Convert main price
    product.price = convertDecimal(product.price);
    
    // Convert pricing tiers
    if (product.pricingTiers) {
      product.pricingTiers = product.pricingTiers.map(tier => ({
        ...tier,
        price: convertDecimal(tier.price)
      }));
    }
    if (product) {
      res.json({ message: "Product fetched successfully", data: product, status: 200 });
    } else {
      res.json({ message: "Product not found", status: 404 });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});

app.get("/manufacturer/:email", async (req, res) => {
  try {
    const manufacturerId = req.params.email;
    const manufacturer = await ManufacturerProfile.findOne({ email: manufacturerId }); 
    if (manufacturer) {
      res.json({ message: "Manufacturer fetched successfully", data: manufacturer , status: 200 });
    } else {
      res.json({ message: "Manufacturer not found", status: 404 });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});

app.get('/products/search-suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Missing search query' });

    const regex = new RegExp(q, 'i'); // case-insensitive partial match

    const suggestions = await Product.find({
      $or: [
        { title: regex },
        { category: regex },
        { tags: regex },
      ]
    }).limit(10).select('title category tags images'); // minimize data

    res.json({ suggestions: suggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Route: GET /api/product/trade/search?searchKeywords=...

app.get("/product/trade/search", async (req, res) => {
  try {
    const searchKeywords = (req.query.searchKeywords || "").toString().trim();

    // Return empty result if no search string
    if (!searchKeywords) {
      return res.status(200).json({ message: "No search keywords provided", products: [] });
    }

    const regex = new RegExp(searchKeywords, "i"); // case-insensitive

    const products = await Product.find({
      $or: [
        { title: regex },
        { category: regex },
        { tags: regex }
      ]
    })
      .sort({ createdAt: -1 }) // Sort by most recent
      .limit(50); // Optional limit

    res.status(200).json({
      message: "Products fetched successfully",
      products,
      status: 200
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: error.message || "Something went wrong", status: 500 });
  }
});

app.get("/getAddresses", async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.query.userId });
    res.json({ success: true, data: addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching addresses", error: err });
  }
});

app.post("/add-address", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing userId in query parameters" });
    }

    const {
      name,
      company,
      address,
      city,
      state,
      zipCode,
      country,
      phone,
      isDefault
    } = req.body;

    const newAddress = new Address({
      userId,
      name,
      company,
      address,
      city,
      state,
      zipCode,
      country,
      phone,
      isDefault
    });

    await newAddress.save();

    res.status(201).json({ success: true, message: "Address added successfully", data: newAddress });
  } catch (err) {
    console.error("Error adding address:", err);
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
});

app.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.post("/submit-order", async (req, res) => {
  try {
    const {
      userId,
      product,
      shippingAddress,
      shipping_type,
      paymentMethod,
      shippingFee,
      tax,
      totalAmount,
      razorpayPaymentId
    } = req.body;

    const newOrder = new Order({
      userId,
      product,
      shippingAddress,
      paymentMethod,
      shipping_type,
      paymentStatus: "Paid",
      shippingStatus: "Pending",
      trackingNumber: "", // You can generate one later
      shippingFee,
      tax,
      totalAmount,
      status: "Confirmed"
    });

    await newOrder.save();
    res.status(201).json({ message: "Order saved", orderId: newOrder._id });
  } catch (err) {
    console.error("Failed to save order", err);
    res.status(500).json({ error: "Failed to submit order" });
  }
});

app.get("/orders", async (req, res) => {
  try {
    userEmail = req.query.email;
    const orders = await Order.find({ userId: userEmail });
    if (orders.length > 0) {
      res.json({message: "Orders fetched successfully", orders});
    }
  } catch (err) {
    console.error("Failed to fetch orders", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.get("/order/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);
    if (order) {
      res.json({message: "Order fetched successfully", order});
    }
  } catch (err) {
    console.error("Failed to fetch order", err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

app.post("/quotations", async (req, res) => {
  try {

    const {
      senderId,
      senderName,
      message,
      productInterest,
      quantity,
      budget,
      deliveryLocation,
      productId
    } = req.body;

    console.log(req.body);  

    const newRequest = new QuotationRequest({
      senderId,
      senderName,
      message,
      productInterest,
      productId,
      quantity,
      budget,
      deliveryLocation
    });

    await newRequest.save();

    res.status(201).json({ 
      success: true,
      data: newRequest
    });
  } catch (error) {
    console.error("Error creating quotation request:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to create quotation request"
    });
  }
});

// app.get('/orders/manufacturer', async (req, res) => {
//   try {
//     const { userEmail } = req.query;

//     if (!userEmail) {
//       return res.status(400).json({ message: 'Manufacturer email is required' });
//     }

    // Find the manufacturer's products first
    // 1. First find all products by this manufacturer
// const manufacturerProducts = await Product.find(
//   { manufacturerEmail: userEmail },
//   { _id: 1 } // Only get the IDs
// );

// if (!manufacturerProducts.length) {
//   return res.status(200).json([]);
// }

// const productIds = manufacturerProducts.map(p => p._id);

// // 2. Debug: Verify product IDs
// console.log('Manufacturer Product IDs:', productIds);

// // 3. Find orders containing these products
// const orders = await Order.find({
//   'product.productId': { $in: productIds }
// });

// // 4. Debug: Check raw orders before processing
// console.log('Raw Orders:', orders);

// // 5. Format the orders for response
// const formattedOrders = orders.map(order => {
//   const product = order.product;
//   return {
//     ...order.toObject(),
//     _id: order._id,
//     product: {
//       ...product,
//       title: product.productId?.title || 'Unknown Product',
//       image: product.productId?.images?.[0] || null,
//       productId: product.productId?._id || product.productId
//     },
//     user: order.userId,
//     userId: order.userId?._id || order.userId
//   };
// });

// // 6. Debug: Check final output
// console.log('Formatted Orders:', formattedOrders);

// res.status(200).json(formattedOrders);

//     res.status(200).json(formattedOrders);
//   } catch (error) {
//     console.error('Error fetching manufacturer orders:', error);
//     res.status(500).json({ message: 'Server error while fetching orders' });
//   }
// });

module.exports = app;