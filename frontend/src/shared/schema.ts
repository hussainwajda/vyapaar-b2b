import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const manufacturers = pgTable("manufacturers", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  companyName: text("company_name").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  address: text("address"),
  description: text("description"),
  logo: text("logo"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  _id: serial("id").primaryKey(),
  manufacturerId: integer("manufacturer_id").references(() => manufacturers.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),
  minOrderQuantity: integer("min_order_quantity").default(1),
  stock: integer("stock").default(0),
  images: text("images").array(),
  videos: text("videos").array(),
  specifications: text("specifications"),
  status: text("status").default("active"), // active, inactive, draft
  // Pricing tiers for quantity-based pricing
  pricingTiers: text("pricing_tiers"), // JSON string: [{ minQty, maxQty, price }]
  // Product variants (colors, sizes, models, etc.)
  variants: text("variants"), // JSON string: [{ name, options: [{ label, value, priceModifier?, stockModifier? }] }]
  // Additional product details
  dimensions: text("dimensions"), // JSON string: { length, width, height, weight, unit }
  materials: text("materials"),
  certifications: text("certifications").array(),
  warranty: text("warranty"),
  leadTime: text("lead_time"), // Manufacturing/delivery lead time
  customizable: boolean("customizable").default(false),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const requests = pgTable("requests", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => manufacturers.id).notNull(),
  receiverId: integer("receiver_id").references(() => manufacturers.id).notNull(),
  message: text("message").notNull(),
  status: text("status").default("pending"), // pending, accepted, rejected, contacted
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => manufacturers.id).notNull(),
  receiverId: integer("receiver_id").references(() => manufacturers.id).notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  isArchived: boolean("is_archived").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => manufacturers.id).notNull(),
  type: text("type").notNull(), // product_added, request_received, inquiry_received, low_stock
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertManufacturerSchema = createInsertSchema(manufacturers).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRequestSchema = createInsertSchema(requests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

// Types
export type Manufacturer = typeof manufacturers.$inferSelect;
export type InsertManufacturer = z.infer<typeof insertManufacturerSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Request = typeof requests.$inferSelect;
export type InsertRequest = z.infer<typeof insertRequestSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

// Legacy user exports for compatibility
export const users = manufacturers;
export type User = Manufacturer;
export type InsertUser = InsertManufacturer;
export const insertUserSchema = insertManufacturerSchema;
