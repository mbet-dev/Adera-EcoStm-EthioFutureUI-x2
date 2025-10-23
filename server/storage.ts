// Referenced from javascript_database blueprint - using DatabaseStorage
import { db } from "./db";
import { eq, desc, and, or } from "drizzle-orm";
import {
  users, partners, shops, items, parcels, parcelEvents, orders,
  transactions, messages, notifications, repositories,
  type User, type InsertUser,
  type Partner, type InsertPartner,
  type Shop, type InsertShop,
  type Item, type InsertItem,
  type Parcel, type InsertParcel,
  type ParcelEvent, type InsertParcelEvent,
  type Order, type InsertOrder,
  type Transaction, type InsertTransaction,
  type Message, type InsertMessage,
  type Notification, type InsertNotification,
  type Repository, type InsertRepository,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(id: string, balance: string): Promise<void>;
  
  // Partners
  getPartner(id: string): Promise<Partner | undefined>;
  getPartnersByCategory(category: string): Promise<Partner[]>;
  createPartner(partner: InsertPartner): Promise<Partner>;
  getAllPartners(): Promise<Partner[]>;
  
  // Shops
  getShop(id: string): Promise<Shop | undefined>;
  getShopsByPartner(partnerId: string): Promise<Shop[]>;
  createShop(shop: InsertShop): Promise<Shop>;
  
  // Items
  getItem(id: string): Promise<Item | undefined>;
  getItemsByShop(shopId: string): Promise<Item[]>;
  createItem(item: InsertItem): Promise<Item>;
  getAllItems(): Promise<Item[]>;
  
  // Parcels
  getParcel(id: string): Promise<Parcel | undefined>;
  getParcelByTrackingId(trackingId: string): Promise<Parcel | undefined>;
  getParcelsBySender(senderId: string): Promise<Parcel[]>;
  getParcelsByDriver(driverId: string): Promise<Parcel[]>;
  createParcel(parcel: InsertParcel): Promise<Parcel>;
  updateParcelStatus(id: string, status: string, driverId?: string): Promise<void>;
  
  // Parcel Events
  createParcelEvent(event: InsertParcelEvent): Promise<ParcelEvent>;
  getParcelEvents(parcelId: string): Promise<ParcelEvent[]>;
  
  // Orders
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByCustomer(customerId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  
  // Transactions
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByUser(userId: string): Promise<Transaction[]>;
  
  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]>;
  
  // Notifications
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotificationsByUser(userId: string): Promise<Notification[]>;
  markNotificationAsRead(id: string): Promise<void>;
  
  // Repositories
  createRepository(repository: InsertRepository): Promise<Repository>;
  getRepositoriesByUser(userId: string): Promise<Repository[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserBalance(id: string, balance: string): Promise<void> {
    await db.update(users).set({ walletBalance: balance }).where(eq(users.id, id));
  }

  // Partners
  async getPartner(id: string): Promise<Partner | undefined> {
    const [partner] = await db.select().from(partners).where(eq(partners.id, id));
    return partner || undefined;
  }

  async getPartnersByCategory(category: string): Promise<Partner[]> {
    return db.select().from(partners).where(eq(partners.category, category));
  }

  async createPartner(insertPartner: InsertPartner): Promise<Partner> {
    const [partner] = await db.insert(partners).values(insertPartner).returning();
    return partner;
  }

  async getAllPartners(): Promise<Partner[]> {
    return db.select().from(partners);
  }

  // Shops
  async getShop(id: string): Promise<Shop | undefined> {
    const [shop] = await db.select().from(shops).where(eq(shops.id, id));
    return shop || undefined;
  }

  async getShopsByPartner(partnerId: string): Promise<Shop[]> {
    return db.select().from(shops).where(eq(shops.partnerId, partnerId));
  }

  async createShop(insertShop: InsertShop): Promise<Shop> {
    const [shop] = await db.insert(shops).values(insertShop).returning();
    return shop;
  }

  // Items
  async getItem(id: string): Promise<Item | undefined> {
    const [item] = await db.select().from(items).where(eq(items.id, id));
    return item || undefined;
  }

  async getItemsByShop(shopId: string): Promise<Item[]> {
    return db.select().from(items).where(eq(items.shopId, shopId));
  }

  async createItem(insertItem: InsertItem): Promise<Item> {
    const [item] = await db.insert(items).values(insertItem).returning();
    return item;
  }

  async getAllItems(): Promise<Item[]> {
    return db.select().from(items).where(eq(items.isActive, true));
  }

  // Parcels
  async getParcel(id: string): Promise<Parcel | undefined> {
    const [parcel] = await db.select().from(parcels).where(eq(parcels.id, id));
    return parcel || undefined;
  }

  async getParcelByTrackingId(trackingId: string): Promise<Parcel | undefined> {
    const [parcel] = await db.select().from(parcels).where(eq(parcels.trackingId, trackingId));
    return parcel || undefined;
  }

  async getParcelsBySender(senderId: string): Promise<Parcel[]> {
    return db.select().from(parcels).where(eq(parcels.senderId, senderId)).orderBy(desc(parcels.createdAt));
  }

  async getParcelsByDriver(driverId: string): Promise<Parcel[]> {
    return db.select().from(parcels).where(eq(parcels.driverId, driverId)).orderBy(desc(parcels.createdAt));
  }

  async createParcel(insertParcel: InsertParcel): Promise<Parcel> {
    const [parcel] = await db.insert(parcels).values(insertParcel).returning();
    return parcel;
  }

  async updateParcelStatus(id: string, status: string, driverId?: string): Promise<void> {
    const updateData: any = { status };
    if (driverId) {
      updateData.driverId = driverId;
    }
    await db.update(parcels).set(updateData).where(eq(parcels.id, id));
  }

  // Parcel Events
  async createParcelEvent(insertEvent: InsertParcelEvent): Promise<ParcelEvent> {
    const [event] = await db.insert(parcelEvents).values(insertEvent).returning();
    return event;
  }

  async getParcelEvents(parcelId: string): Promise<ParcelEvent[]> {
    return db.select().from(parcelEvents).where(eq(parcelEvents.parcelId, parcelId)).orderBy(desc(parcelEvents.createdAt));
  }

  // Orders
  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.customerId, customerId)).orderBy(desc(orders.createdAt));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }

  // Transactions
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db.insert(transactions).values(insertTransaction).returning();
    return transaction;
  }

  async getTransactionsByUser(userId: string): Promise<Transaction[]> {
    return db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.createdAt));
  }

  // Messages
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }

  async getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]> {
    return db.select().from(messages).where(
      or(
        and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
        and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1))
      )
    ).orderBy(desc(messages.createdAt));
  }

  // Notifications
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications).values(insertNotification).returning();
    return notification;
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
  }

  // Repositories
  async createRepository(insertRepository: InsertRepository): Promise<Repository> {
    const [repository] = await db.insert(repositories).values(insertRepository).returning();
    return repository;
  }

  async getRepositoriesByUser(userId: string): Promise<Repository[]> {
    return db.select().from(repositories).where(eq(repositories.userId, userId)).orderBy(desc(repositories.createdAt));
  }
}

export const storage = new DatabaseStorage();
