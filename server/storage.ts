// Using Supabase client for database operations
import { supabase } from "./db";
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
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    return data || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    return data || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(insertUser)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateUserBalance(id: string, balance: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ walletBalance: balance })
      .eq('id', id);
    if (error) throw error;
  }

  // Partners
  async getPartner(id: string): Promise<Partner | undefined> {
    const { data } = await supabase
      .from('partners')
      .select('*')
      .eq('id', id)
      .single();
    return data || undefined;
  }

  async getPartnersByCategory(category: string): Promise<Partner[]> {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('category', category);
    if (error) throw error;
    return data || [];
  }

  async createPartner(insertPartner: InsertPartner): Promise<Partner> {
    const { data, error } = await supabase
      .from('partners')
      .insert(insertPartner)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async getAllPartners(): Promise<Partner[]> {
    const { data, error } = await supabase
      .from('partners')
      .select('*');
    if (error) throw error;
    return data || [];
  }

  // Shops
  async getShop(id: string): Promise<Shop | undefined> {
    const { data } = await supabase
      .from('shops')
      .select('*')
      .eq('id', id)
      .single();
    return data || undefined;
  }

  async getShopsByPartner(partnerId: string): Promise<Shop[]> {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('partnerId', partnerId);
    if (error) throw error;
    return data || [];
  }

  async createShop(insertShop: InsertShop): Promise<Shop> {
    const { data, error } = await supabase
      .from('shops')
      .insert(insertShop)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Items
  async getItem(id: string): Promise<Item | undefined> {
    const { data } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single();
    return data || undefined;
  }

  async getItemsByShop(shopId: string): Promise<Item[]> {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('shopId', shopId);
    if (error) throw error;
    return data || [];
  }

  async createItem(insertItem: InsertItem): Promise<Item> {
    const { data, error } = await supabase
      .from('items')
      .insert(insertItem)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async getAllItems(): Promise<Item[]> {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('isActive', true);
    if (error) throw error;
    return data || [];
  }

  // Parcels
  async getParcel(id: string): Promise<Parcel | undefined> {
    const { data } = await supabase
      .from('parcels')
      .select('*')
      .eq('id', id)
      .single();
    return data || undefined;
  }

  async getParcelByTrackingId(trackingId: string): Promise<Parcel | undefined> {
    const { data } = await supabase
      .from('parcels')
      .select('*')
      .eq('trackingId', trackingId)
      .single();
    return data || undefined;
  }

  async getParcelsBySender(senderId: string): Promise<Parcel[]> {
    const { data, error } = await supabase
      .from('parcels')
      .select('*')
      .eq('senderId', senderId)
      .order('createdAt', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async getParcelsByDriver(driverId: string): Promise<Parcel[]> {
    const { data, error } = await supabase
      .from('parcels')
      .select('*')
      .eq('driverId', driverId)
      .order('createdAt', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async createParcel(insertParcel: InsertParcel): Promise<Parcel> {
    const { data, error } = await supabase
      .from('parcels')
      .insert(insertParcel)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateParcelStatus(id: string, status: string, driverId?: string): Promise<void> {
    const updateData: any = { status };
    if (driverId) {
      updateData.driverId = driverId;
    }
    const { error } = await supabase
      .from('parcels')
      .update(updateData)
      .eq('id', id);
    if (error) throw error;
  }

  // Parcel Events
  async createParcelEvent(insertEvent: InsertParcelEvent): Promise<ParcelEvent> {
    const { data, error } = await supabase
      .from('parcelEvents')
      .insert(insertEvent)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async getParcelEvents(parcelId: string): Promise<ParcelEvent[]> {
    const { data, error } = await supabase
      .from('parcelEvents')
      .select('*')
      .eq('parcelId', parcelId)
      .order('createdAt', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  // Orders
  async getOrder(id: string): Promise<Order | undefined> {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    return data || undefined;
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customerId', customerId)
      .order('createdAt', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .insert(insertOrder)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Transactions
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert(insertTransaction)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async getTransactionsByUser(userId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  // Messages
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert(insertMessage)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`senderId.eq.${userId1},receiverId.eq.${userId2}`)
      .or(`senderId.eq.${userId2},receiverId.eq.${userId1}`)
      .order('createdAt', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  // Notifications
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert(insertNotification)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async markNotificationAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ isRead: true })
      .eq('id', id);
    if (error) throw error;
  }

  // Repositories
  async createRepository(insertRepository: InsertRepository): Promise<Repository> {
    const { data, error } = await supabase
      .from('repositories')
      .insert(insertRepository)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async getRepositoriesByUser(userId: string): Promise<Repository[]> {
    const { data, error } = await supabase
      .from('repositories')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });
    if (error) throw error;
    return data || [];
  }
}

export const storage = new DatabaseStorage();
