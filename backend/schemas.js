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

const pricingTierSchema = new mongoose.Schema({
  minQty: {
    type: Number,
    required: true
  },
  maxQty: {
    type: Number,
    required: true
  },
  price: {
    type: mongoose.Schema.Types.Decimal128,
    required: true
  }
});

const ProductSchema = new mongoose.Schema({
  manufacturerEmail: { type: String, ref: "Manufacturer", required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  price: { type: mongoose.Types.Decimal128, required: true },
  minOrderQuantity: { type: Number, default: 1 },
  stock: { type: Number, default: 0 },
  images: [{ type: String }],
  videos: [{ type: String }],
  specifications: { type: String },
  status: { type: String, default: "active", enum: ["active", "inactive", "draft"] },

  // JSON strings converted to nested structures
  pricingTiers: {
    type: [pricingTierSchema],
    required: true,
    validate: v => Array.isArray(v) && v.length > 0
  },
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

const quotationRequestSchema = new mongoose.Schema({
  receiverId: {
    type: String,
    ref: "User",
    required: true
  },
  senderId: {
    type: String,
    ref: "User",
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  productInterest: {
    type: String,
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  isRead: {
    type: Boolean,
    default: false
  },
  budget: {
    type: String,
    required: true
  },
  deliveryLocation: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const QuotationRequest = mongoose.model("QuotationRequest", quotationRequestSchema);

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

  paymentMethod: { type: String },
  transactionId: { type: String },
  notes: { type: String },
}, { timestamps: true });

const Revenue = mongoose.model("Revenue", RevenueSchema);

const AddressSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true },
  name: { type: String, required: true },
  company: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, default: "India" },
  phone: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

const Address = mongoose.model('Address', AddressSchema);

const OrderSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true },
  product: {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: String,
    image: String,
    quantity: Number,
    unitPrice: mongoose.Types.Decimal128,
    total: mongoose.Types.Decimal128
  },
  shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
  paymentMethod: { type: String, enum: ['card', 'trade-credit', 'bank-transfer', 'financing'], required: true },
  status: { type: String, default: 'Pending' },
  shipping_type: { type: String, default: 'Standard', enum: ['Standard', 'Priority', 'Express', 'Scheduled'] },
  paymentStatus: { type: String, default: 'Pending' },
  shippingStatus: { type: String, default: 'Pending' },
    razorpayDetails: {
    paymentId: String,
    orderId: String,
    signature: String,
    method: String
  },
  trackingNumber: { type: String },
  shippingFee: mongoose.Types.Decimal128,
  tax: mongoose.Types.Decimal128,
  totalAmount: mongoose.Types.Decimal128
}, { timestamps: true });

// Add text index for searching
OrderSchema.index({
  'product.title': 'text',
  status: 'text',
  paymentStatus: 'text',
  trackingNumber: 'text'
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = {
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
};