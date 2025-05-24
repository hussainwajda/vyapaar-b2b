const mongoose = require('mongoose');

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
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  created_at: { type: Date, default: Date.now },
});

const ManufacturerProfile = mongoose.model('ManufacturerProfile', manufacturerProfileSchema);

  const profileTrackSchema = new mongoose.Schema({
    totalProfileRequest: {
      type: Number,
      default: 0,
      required: true,
    },
    totalPending: {
      type: Number,
      default: 0,
      required: true,
    },
    totalApproved: {
      type: Number,
      default: 0,
      required: true,
    },
    totalRejected: {
      type: Number,
      default: 0,
      required: true,
    }
  }, { timestamps: true });

  const ProfileTrack = mongoose.model('ProfileTrack', profileTrackSchema);

const notificationSchema = new mongoose.Schema({
  userId: { type: String , ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['approval', 'rejection', 'general'], required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

const Notification = mongoose.model('Notification', notificationSchema);

const ProductSchema = new mongoose.Schema({
  manufacturerEmail: { type: String, ref: "Manufacturer", required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  price: { type: mongoose.Types.Decimal128, required: true },
  minOrderQuantity: { type: Number, default: 1 },
  stock: { type: Number, default: 0 },
  images: [{ type: String }],
  videos: [{ type: String }],
  specifications: { type: String },
  status: { type: String, default: "active", enum: ["active", "inactive", "draft"] },

  // JSON strings converted to nested structures
  pricingTiers: [{
    minQty: Number,
    maxQty: Number,
    price: mongoose.Types.Decimal128,
  }],
  variants: [{
    name: String,
    options: [{
      label: String,
      value: String,
      priceModifier: mongoose.Types.Decimal128,
      stockModifier: Number,
    }],
  }],
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number,
    unit: String,
  },
  materials: { type: String },
  certifications: [{ type: String }],
  warranty: { type: String },
  leadTime: { type: String },
  customizable: { type: Boolean, default: false },
  tags: [{ type: String }],
}, { timestamps: true });

const Product = mongoose.model("Product", ProductSchema);

const RequestSchema = new mongoose.Schema({
  senderEmail: { type: String, ref: "Manufacturer", required: true },
  receiverEmail: { type: String, ref: "Manufacturer", required: true },
  message: { type: String, required: true },
  status: { type: String, default: "pending", enum: ["pending", "accepted", "rejected", "contacted"] },
}, { timestamps: true });

const Request = mongoose.model("Request", RequestSchema);

const MessageSchema = new mongoose.Schema({
  senderEmail: { type: String, ref: "Manufacturer", required: true },
  receiverEmail: { type: String, ref: "Manufacturer", required: true },
  subject: { type: String },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
}, { timestamps: true });

const Message = mongoose.model("Message", MessageSchema);

const manuNotificationSchema = new mongoose.Schema({
  userEmailId: { type: String, ref: "Manufacturer", required: true },
  type: { type: String, required: true }, // product_added, request_received, etc.
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

const ManuNotification = mongoose.model("MenuNotification", manuNotificationSchema);

const RevenueSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "Manufacturer", required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Manufacturer", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },

  quantity: { type: Number, required: true },
  unitPrice: { type: mongoose.Types.Decimal128, required: true },
  currency: { type: String, default: "USD" },

  grossRevenue: { type: mongoose.Types.Decimal128, required: true }, // quantity * unitPrice
  platformFee: { type: mongoose.Types.Decimal128, default: 0.0 }, // e.g., 5% commission
  tax: { type: mongoose.Types.Decimal128, default: 0.0 },
  netRevenue: { type: mongoose.Types.Decimal128, required: true }, // gross - fee - tax

  paymentStatus: { 
    type: String, 
    enum: ["pending", "paid", "failed", "refunded"], 
    default: "pending" 
  },

  paymentMethod: { type: String }, // e.g., bank_transfer, PayPal, Stripe
  transactionId: { type: String }, // external payment ref

  notes: { type: String },
}, { timestamps: true });

const Revenue = mongoose.model("Revenue", RevenueSchema);


module.exports = {
  ManufacturerProfile,
  ProfileTrack,
  Notification,
  Product,
  Request,
  Message,
  ManuNotification,
  Revenue
};