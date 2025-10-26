// Referenced from javascript_websocket blueprint for WebSocket setup
import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertUserSchema, insertParcelSchema, insertOrderSchema, insertPartnerSchema, insertShopSchema, insertItemSchema } from "@shared/schema";
import { pool } from "./db";
import bcrypt from "bcrypt";
import crypto from "crypto";
import QRCode from "qrcode";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Authentication Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...data,
        password: hashedPassword,
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // User Routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Partner Routes
  app.get("/api/partners", async (req, res) => {
    try {
      const partners = await storage.getAllPartners();
      res.json(partners);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch partners" });
    }
  });

  app.post("/api/partners", async (req, res) => {
    try {
      const data = insertPartnerSchema.parse(req.body);
      const partner = await storage.createPartner(data);
      res.json(partner);
    } catch (error) {
      console.error("Create partner error:", error);
      res.status(400).json({ error: "Failed to create partner" });
    }
  });

  app.get("/api/partners/:id", async (req, res) => {
    try {
      const partner = await storage.getPartner(req.params.id);
      if (!partner) {
        return res.status(404).json({ error: "Partner not found" });
      }
      res.json(partner);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch partner" });
    }
  });

  // Shop Routes
  app.get("/api/shops/partner/:partnerId", async (req, res) => {
    try {
      const shops = await storage.getShopsByPartner(req.params.partnerId);
      res.json(shops);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shops" });
    }
  });

  app.post("/api/shops", async (req, res) => {
    try {
      const data = insertShopSchema.parse(req.body);
      const shop = await storage.createShop(data);
      res.json(shop);
    } catch (error) {
      console.error("Create shop error:", error);
      res.status(400).json({ error: "Failed to create shop" });
    }
  });

  // Item Routes
  app.get("/api/items", async (req, res) => {
    try {
      const items = await storage.getAllItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });

  app.get("/api/items/shop/:shopId", async (req, res) => {
    try {
      const items = await storage.getItemsByShop(req.params.shopId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });

  app.post("/api/items", async (req, res) => {
    try {
      const data = insertItemSchema.parse(req.body);
      const item = await storage.createItem(data);
      res.json(item);
    } catch (error) {
      console.error("Create item error:", error);
      res.status(400).json({ error: "Failed to create item" });
    }
  });

  // Parcel Routes
  app.post("/api/parcels", async (req, res) => {
    try {
      const data = insertParcelSchema.parse(req.body);
      
      // Generate tracking ID and QR hash
      const trackingId = `ADR-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const qrHash = crypto.createHash('sha256').update(trackingId).digest('hex');

      const parcel = await storage.createParcel({
        ...data,
        trackingId,
        qrHash,
      });

      // Create initial event
      await storage.createParcelEvent({
        parcelId: parcel.id,
        actorId: parcel.senderId,
        actorRole: "customer",
        status: "pending",
        notes: "Parcel created",
      });

      res.json(parcel);
    } catch (error) {
      console.error("Create parcel error:", error);
      res.status(400).json({ error: "Failed to create parcel" });
    }
  });

  app.get("/api/parcels/sender/:senderId", async (req, res) => {
    try {
      const parcels = await storage.getParcelsBySender(req.params.senderId);
      res.json(parcels);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch parcels" });
    }
  });

  app.get("/api/parcels/driver/:driverId", async (req, res) => {
    try {
      const parcels = await storage.getParcelsByDriver(req.params.driverId);
      res.json(parcels);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch parcels" });
    }
  });

  app.get("/api/parcels/tracking/:trackingId", async (req, res) => {
    try {
      const parcel = await storage.getParcelByTrackingId(req.params.trackingId);
      if (!parcel) {
        return res.status(404).json({ error: "Parcel not found" });
      }
      
      // Get parcel events
      const events = await storage.getParcelEvents(parcel.id);
      
      res.json({ parcel, events });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch parcel" });
    }
  });

  app.patch("/api/parcels/:id/status", async (req, res) => {
    try {
      const { status, actorId, actorRole, notes, driverId } = req.body;
      
      await storage.updateParcelStatus(req.params.id, status, driverId);
      
      // Create event
      await storage.createParcelEvent({
        parcelId: req.params.id,
        actorId,
        actorRole,
        status,
        notes,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Update parcel status error:", error);
      res.status(400).json({ error: "Failed to update parcel status" });
    }
  });

  // QR Code Generation
  app.get("/api/qr/:trackingId", async (req, res) => {
    try {
      const qrCode = await QRCode.toDataURL(req.params.trackingId);
      res.json({ qrCode });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate QR code" });
    }
  });

  // Order Routes
  app.get("/api/orders/customer/:customerId", async (req, res) => {
    try {
      const orders = await storage.getOrdersByCustomer(req.params.customerId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const data = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(data);
      res.json(order);
    } catch (error) {
      console.error("Create order error:", error);
      res.status(400).json({ error: "Failed to create order" });
    }
  });

  // Transaction Routes
  app.get("/api/transactions/:userId", async (req, res) => {
    try {
      const transactions = await storage.getTransactionsByUser(req.params.userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const { userId, amount, type, method, description } = req.body;
      
      const transaction = await storage.createTransaction({
        userId,
        amount,
        type,
        method,
        status: "completed",
        description,
      });

      // Update user balance if deposit
      if (type === "deposit") {
        const user = await storage.getUser(userId);
        if (user) {
          const newBalance = (parseFloat(user.walletBalance) + parseFloat(amount)).toFixed(2);
          await storage.updateUserBalance(userId, newBalance);
        }
      }

      res.json(transaction);
    } catch (error) {
      console.error("Create transaction error:", error);
      res.status(400).json({ error: "Failed to create transaction" });
    }
  });

  // Notification Routes
  app.get("/api/notifications/:userId", async (req, res) => {
    try {
      const notifications = await storage.getNotificationsByUser(req.params.userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const notification = await storage.createNotification(req.body);
      res.json(notification);
    } catch (error) {
      res.status(400).json({ error: "Failed to create notification" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Failed to mark notification as read" });
    }
  });

  // Repository Routes
  app.get("/api/repositories/:userId", async (req, res) => {
    try {
      const repositories = await storage.getRepositoriesByUser(req.params.userId);
      res.json(repositories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch repositories" });
    }
  });

  app.post("/api/repositories", async (req, res) => {
    try {
      const repository = await storage.createRepository(req.body);
      res.json(repository);
    } catch (error) {
      res.status(400).json({ error: "Failed to create repository" });
    }
  });

  // WebSocket Chat Server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  const clients = new Map<string, WebSocket>();

  wss.on('connection', (ws: WebSocket) => {
    let userId: string | null = null;

    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === 'auth') {
          userId = data.userId;
          clients.set(userId, ws);
          ws.send(JSON.stringify({ type: 'auth', success: true }));
        }

        if (data.type === 'message' && userId) {
          // Save message to database
          const savedMessage = await storage.createMessage({
            senderId: userId!,
            receiverId: data.receiverId,
            parcelId: data.parcelId,
            text: data.text,
          });

          // Send to receiver if online
          const receiverWs = clients.get(data.receiverId);
          if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
            receiverWs.send(JSON.stringify({
              type: 'message',
              message: savedMessage,
            }));
          }

          // Confirm to sender
          ws.send(JSON.stringify({
            type: 'message_sent',
            message: savedMessage,
          }));
        }
      } catch (error) {
        console.error('WebSocket error:', error);
      }
    });

    ws.on('close', () => {
      if (userId) {
        clients.delete(userId);
      }
    });
  });

  return httpServer;
}
