import { 
  type User, 
  type InsertUser, 
  type WorkerProfile, 
  type InsertWorkerProfile,
  type EmployerProfile,
  type InsertEmployerProfile,
  type Connection,
  type InsertConnection,
  type ChatMessage,
  type InsertChatMessage,
  type ContactMessage,
  type InsertContactMessage,
  type WorkerWithProfile,
  type ConnectionWithWorker
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Worker profile operations
  createWorkerProfile(profile: InsertWorkerProfile): Promise<WorkerProfile>;
  getWorkerProfile(userId: string): Promise<WorkerProfile | undefined>;
  getWorkersWithProfiles(filters?: {
    skills?: string;
    location?: string;
    availability?: string;
  }): Promise<WorkerWithProfile[]>;
  
  // Employer profile operations
  createEmployerProfile(profile: InsertEmployerProfile): Promise<EmployerProfile>;
  getEmployerProfile(userId: string): Promise<EmployerProfile | undefined>;
  
  // Connection operations
  createConnection(connection: InsertConnection): Promise<Connection>;
  getConnectionsByEmployer(employerId: string): Promise<ConnectionWithWorker[]>;
  getConnectionsByWorker(workerId: string): Promise<Connection[]>;
  
  // Chat operations
  addChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(limit?: number): Promise<ChatMessage[]>;
  
  // Contact operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private workerProfiles: Map<string, WorkerProfile>;
  private employerProfiles: Map<string, EmployerProfile>;
  private connections: Map<string, Connection>;
  private chatMessages: ChatMessage[];
  private contactMessages: Map<string, ContactMessage>;

  constructor() {
    this.users = new Map();
    this.workerProfiles = new Map();
    this.employerProfiles = new Map();
    this.connections = new Map();
    this.chatMessages = [];
    this.contactMessages = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser,
      phone: insertUser.phone ?? null,
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async createWorkerProfile(insertProfile: InsertWorkerProfile): Promise<WorkerProfile> {
    const id = randomUUID();
    const profile: WorkerProfile = { 
      ...insertProfile, 
      id,
      description: insertProfile.description ?? null,
      hourlyRate: insertProfile.hourlyRate ?? null,
      availability: insertProfile.availability ?? "Available Now"
    };
    this.workerProfiles.set(id, profile);
    return profile;
  }

  async getWorkerProfile(userId: string): Promise<WorkerProfile | undefined> {
    return Array.from(this.workerProfiles.values()).find(profile => profile.userId === userId);
  }

  async getWorkersWithProfiles(filters?: {
    skills?: string;
    location?: string;
    availability?: string;
  }): Promise<WorkerWithProfile[]> {
    const workers: WorkerWithProfile[] = [];
    
    for (const profile of Array.from(this.workerProfiles.values())) {
      const user = this.users.get(profile.userId);
      if (user && user.role === 'worker') {
        // Apply filters
        if (filters?.skills && !profile.skills.toLowerCase().includes(filters.skills.toLowerCase())) {
          continue;
        }
        if (filters?.location && !profile.location.toLowerCase().includes(filters.location.toLowerCase())) {
          continue;
        }
        if (filters?.availability && profile.availability !== filters.availability) {
          continue;
        }
        
        workers.push({
          ...user,
          workerProfile: profile
        });
      }
    }
    
    return workers;
  }

  async createEmployerProfile(insertProfile: InsertEmployerProfile): Promise<EmployerProfile> {
    const id = randomUUID();
    const profile: EmployerProfile = { 
      ...insertProfile, 
      id,
      location: insertProfile.location ?? null,
      jobNeeds: insertProfile.jobNeeds ?? null
    };
    this.employerProfiles.set(id, profile);
    return profile;
  }

  async getEmployerProfile(userId: string): Promise<EmployerProfile | undefined> {
    return Array.from(this.employerProfiles.values()).find(profile => profile.userId === userId);
  }

  async createConnection(insertConnection: InsertConnection): Promise<Connection> {
    const id = randomUUID();
    const connection: Connection = { 
      ...insertConnection,
      status: insertConnection.status ?? "connected",
      lastProject: insertConnection.lastProject ?? null,
      id, 
      createdAt: new Date() 
    };
    this.connections.set(id, connection);
    return connection;
  }

  async getConnectionsByEmployer(employerId: string): Promise<ConnectionWithWorker[]> {
    const employerConnections: ConnectionWithWorker[] = [];
    
    for (const connection of Array.from(this.connections.values())) {
      if (connection.employerId === employerId) {
        const worker = this.users.get(connection.workerId);
        const workerProfile = await this.getWorkerProfile(connection.workerId);
        
        if (worker && workerProfile) {
          employerConnections.push({
            ...connection,
            worker: {
              ...worker,
              workerProfile
            }
          });
        }
      }
    }
    
    return employerConnections;
  }

  async getConnectionsByWorker(workerId: string): Promise<Connection[]> {
    return Array.from(this.connections.values()).filter(
      connection => connection.workerId === workerId
    );
  }

  async addChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = { 
      ...insertMessage, 
      id, 
      timestamp: new Date() 
    };
    this.chatMessages.push(message);
    return message;
  }

  async getChatMessages(limit: number = 50): Promise<ChatMessage[]> {
    return this.chatMessages
      .sort((a, b) => (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0))
      .slice(-limit);
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = randomUUID();
    const message: ContactMessage = { 
      ...insertMessage, 
      id, 
      createdAt: new Date() 
    };
    this.contactMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
