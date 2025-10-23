import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, json, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["customer", "partner", "driver", "personnel", "admin", "guest"]);
export const parcelStatusEnum = pgEnum("parcel_status", ["pending", "picked_up", "in_transit", "at_hub", "out_for_delivery", "delivered", "failed", "cancelled"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "processing", "shipped", "delivered", "cancelled"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["deposit", "withdrawal", "payment", "refund", "commission"]);
export const paymentMethodEnum = pgEnum("payment_method", ["wallet", "cash_on_delivery", "telebirr", "chapa", "arifpay"]);
export const languageEnum = pgEnum("language", ["en", "am"]);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  role: userRoleEnum("role").notNull().default("customer"),
  language: languageEnum("language").notNull().default("en"),
  walletBalance: decimal("wallet_balance", { precision: 10, scale: 2 }).notNull().default("0.00"),
  avatar: text("avatar"),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Partners table (pickup/dropoff points and vendors)
export const partners = pgTable("partners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  businessName: text("business_name").notNull(),
  category: text("category").notNull(), // "pickup_point", "shop", "both"
  description: text("description"),
  address: text("address").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
  phone: text("phone").notNull(),
  isVerified: boolean("is_verified").notNull().default(false),
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull().default("0.00"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalRatings: integer("total_ratings").notNull().default(0),
  banner: text("banner"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Shops table (partner storefronts)
export const shops = pgTable("shops", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: varchar("partner_id").notNull().references(() => partners.id),
  name: text("name").notNull(),
  description: text("description"),
  banner: text("banner"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Items table (shop products)
export const items = pgTable("items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shopId: varchar("shop_id").notNull().references(() => shops.id),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull().default(0),
  category: text("category"),
  images: json("images").$type<string[]>().default([]),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalRatings: integer("total_ratings").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Parcels table
export const parcels = pgTable("parcels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trackingId: text("tracking_id").notNull().unique(),
  qrHash: text("qr_hash").notNull().unique(),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  recipientName: text("recipient_name").notNull(),
  recipientPhone: text("recipient_phone").notNull(),
  pickupPartnerId: varchar("pickup_partner_id").references(() => partners.id),
  dropoffPartnerId: varchar("dropoff_partner_id").references(() => partners.id),
  driverId: varchar("driver_id").references(() => users.id),
  status: parcelStatusEnum("status").notNull().default("pending"),
  weight: decimal("weight", { precision: 5, scale: 2 }).notNull(), // in kg
  distance: decimal("distance", { precision: 6, scale: 2 }), // in km
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  isPaid: boolean("is_paid").notNull().default(false),
  description: text("description"),
  photos: json("photos").$type<string[]>().default([]),
  deliveryProof: text("delivery_proof"),
  rating: integer("rating"),
  review: text("review"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  deliveredAt: timestamp("delivered_at"),
});

// Parcel Events table (audit trail)
export const parcelEvents = pgTable("parcel_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  parcelId: varchar("parcel_id").notNull().references(() => parcels.id),
  actorId: varchar("actor_id").notNull().references(() => users.id),
  actorRole: userRoleEnum("actor_role").notNull(),
  status: parcelStatusEnum("status").notNull(),
  location: text("location"),
  notes: text("notes"),
  photo: text("photo"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Orders table (e-commerce orders)
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => users.id),
  itemId: varchar("item_id").notNull().references(() => items.id),
  quantity: integer("quantity").notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  parcelId: varchar("parcel_id").references(() => parcels.id),
  status: orderStatusEnum("status").notNull().default("pending"),
  deliveryAddress: text("delivery_address").notNull(),
  deliveryPhone: text("delivery_phone").notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  isPaid: boolean("is_paid").notNull().default(false),
  rating: integer("rating"),
  review: text("review"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: transactionTypeEnum("type").notNull(),
  method: paymentMethodEnum("method"),
  status: text("status").notNull().default("completed"), // "pending", "completed", "failed"
  reference: text("reference"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Messages table (chat)
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").notNull().references(() => users.id),
  parcelId: varchar("parcel_id").references(() => parcels.id),
  text: text("text").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  body: text("body").notNull(),
  type: text("type"), // "parcel", "order", "payment", "system"
  referenceId: varchar("reference_id"), // parcel_id or order_id
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Repository table (saved notes, links, screenshots)
export const repositories = pgTable("repositories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // "note", "link", "screenshot"
  title: text("title").notNull(),
  content: text("content"),
  url: text("url"),
  image: text("image"),
  tags: json("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  parcelsAsSender: many(parcels, { relationName: "senderParcels" }),
  parcelsAsDriver: many(parcels, { relationName: "driverParcels" }),
  partners: many(partners),
  orders: many(orders),
  transactions: many(transactions),
  messagesSent: many(messages, { relationName: "sentMessages" }),
  messagesReceived: many(messages, { relationName: "receivedMessages" }),
  notifications: many(notifications),
  repositories: many(repositories),
  parcelEvents: many(parcelEvents),
}));

export const partnersRelations = relations(partners, ({ one, many }) => ({
  user: one(users, {
    fields: [partners.userId],
    references: [users.id],
  }),
  shops: many(shops),
  parcelsAsPickup: many(parcels, { relationName: "pickupParcels" }),
  parcelsAsDropoff: many(parcels, { relationName: "dropoffParcels" }),
}));

export const shopsRelations = relations(shops, ({ one, many }) => ({
  partner: one(partners, {
    fields: [shops.partnerId],
    references: [partners.id],
  }),
  items: many(items),
}));

export const itemsRelations = relations(items, ({ one, many }) => ({
  shop: one(shops, {
    fields: [items.shopId],
    references: [shops.id],
  }),
  orders: many(orders),
}));

export const parcelsRelations = relations(parcels, ({ one, many }) => ({
  sender: one(users, {
    fields: [parcels.senderId],
    references: [users.id],
    relationName: "senderParcels",
  }),
  driver: one(users, {
    fields: [parcels.driverId],
    references: [users.id],
    relationName: "driverParcels",
  }),
  pickupPartner: one(partners, {
    fields: [parcels.pickupPartnerId],
    references: [partners.id],
    relationName: "pickupParcels",
  }),
  dropoffPartner: one(partners, {
    fields: [parcels.dropoffPartnerId],
    references: [partners.id],
    relationName: "dropoffParcels",
  }),
  events: many(parcelEvents),
  messages: many(messages),
  orders: many(orders),
}));

export const parcelEventsRelations = relations(parcelEvents, ({ one }) => ({
  parcel: one(parcels, {
    fields: [parcelEvents.parcelId],
    references: [parcels.id],
  }),
  actor: one(users, {
    fields: [parcelEvents.actorId],
    references: [users.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id],
  }),
  item: one(items, {
    fields: [orders.itemId],
    references: [items.id],
  }),
  parcel: one(parcels, {
    fields: [orders.parcelId],
    references: [parcels.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sentMessages",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receivedMessages",
  }),
  parcel: one(parcels, {
    fields: [messages.parcelId],
    references: [parcels.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const repositoriesRelations = relations(repositories, ({ one }) => ({
  user: one(users, {
    fields: [repositories.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertPartnerSchema = createInsertSchema(partners).omit({ id: true, createdAt: true, balance: true, rating: true, totalRatings: true });
export const insertShopSchema = createInsertSchema(shops).omit({ id: true, createdAt: true });
export const insertItemSchema = createInsertSchema(items).omit({ id: true, createdAt: true, rating: true, totalRatings: true });
export const insertParcelSchema = createInsertSchema(parcels).omit({ id: true, createdAt: true, deliveredAt: true });
export const insertParcelEventSchema = createInsertSchema(parcelEvents).omit({ id: true, createdAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, completedAt: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export const insertRepositorySchema = createInsertSchema(repositories).omit({ id: true, createdAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPartner = z.infer<typeof insertPartnerSchema>;
export type Partner = typeof partners.$inferSelect;

export type InsertShop = z.infer<typeof insertShopSchema>;
export type Shop = typeof shops.$inferSelect;

export type InsertItem = z.infer<typeof insertItemSchema>;
export type Item = typeof items.$inferSelect;

export type InsertParcel = z.infer<typeof insertParcelSchema>;
export type Parcel = typeof parcels.$inferSelect;

export type InsertParcelEvent = z.infer<typeof insertParcelEventSchema>;
export type ParcelEvent = typeof parcelEvents.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

export type InsertRepository = z.infer<typeof insertRepositorySchema>;
export type Repository = typeof repositories.$inferSelect;
