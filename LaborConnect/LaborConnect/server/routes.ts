import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertWorkerProfileSchema, 
  insertEmployerProfileSchema,
  insertConnectionSchema,
  insertChatMessageSchema,
  insertContactMessageSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket setup for chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('New WebSocket connection');

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'chat_message') {
          // Save message to storage
          const chatMessage = await storage.addChatMessage({
            userId: message.userId,
            userName: message.userName,
            message: message.message
          });

          // Broadcast to all connected clients
          const broadcastMessage = JSON.stringify({
            type: 'chat_message',
            data: chatMessage
          });

          clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(broadcastMessage);
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
      console.log('WebSocket connection closed');
    });
  });

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { role, ...userData } = req.body;
      
      // Validate user data
      const validatedUser = insertUserSchema.parse({
        ...userData,
        role
      });

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedUser.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedUser.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...validatedUser,
        password: hashedPassword
      });

      // Create role-specific profile
      if (role === 'worker') {
        const workerData = insertWorkerProfileSchema.parse({
          userId: user.id,
          skills: req.body.skills,
          experience: req.body.experience,
          location: req.body.location,
          availability: "Available Now"
        });
        await storage.createWorkerProfile(workerData);
      } else if (role === 'employer') {
        const employerData = insertEmployerProfileSchema.parse({
          userId: user.id,
          companyName: req.body.companyName,
          industry: req.body.industry,
          jobNeeds: req.body.jobNeeds,
          location: req.body.location
        });
        await storage.createEmployerProfile(employerData);
      }

      // Return user without password
      const { password, ...userResponse } = user;
      res.status(201).json(userResponse);
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ 
        message: "Registration failed", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Return user without password
      const { password: _, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Worker routes
  app.get("/api/workers", async (req, res) => {
    try {
      const { skills, location, availability } = req.query;
      
      const filters = {
        skills: skills as string,
        location: location as string,
        availability: availability as string
      };

      const workers = await storage.getWorkersWithProfiles(filters);
      res.json(workers);
    } catch (error) {
      console.error('Get workers error:', error);
      res.status(500).json({ message: "Failed to fetch workers" });
    }
  });

  // Connection routes
  app.post("/api/connections", async (req, res) => {
    try {
      const connectionData = insertConnectionSchema.parse(req.body);
      const connection = await storage.createConnection(connectionData);
      res.status(201).json(connection);
    } catch (error) {
      console.error('Create connection error:', error);
      res.status(400).json({ message: "Failed to create connection" });
    }
  });

  app.get("/api/connections/:employerId", async (req, res) => {
    try {
      const { employerId } = req.params;
      const connections = await storage.getConnectionsByEmployer(employerId);
      res.json(connections);
    } catch (error) {
      console.error('Get connections error:', error);
      res.status(500).json({ message: "Failed to fetch connections" });
    }
  });

  // Chat routes
  app.get("/api/chat/messages", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const messages = await storage.getChatMessages(limit);
      res.json(messages);
    } catch (error) {
      console.error('Get chat messages error:', error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Contact routes
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(contactData);
      res.status(201).json({ message: "Message sent successfully", id: message.id });
    } catch (error) {
      console.error('Contact message error:', error);
      res.status(400).json({ message: "Failed to send message" });
    }
  });

  return httpServer;
}
