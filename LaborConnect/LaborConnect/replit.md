# Labor Connect

## Overview

Labor Connect is a full-stack web application that connects skilled workers with employers across various industries including farming, construction, cleaning, and general labor. The platform facilitates job matching, worker discovery, real-time communication, and connection management between workers and employers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Real-time Communication**: WebSocket client for live chat functionality

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with WebSocket support for real-time features
- **Authentication**: Session-based authentication with bcrypt for password hashing
- **Development**: Hot module replacement via Vite integration

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Structure**:
  - Users table with role-based access (worker/employer)
  - Worker profiles with skills, experience, and availability
  - Employer profiles with company information and job needs
  - Connections table for tracking worker-employer relationships
  - Chat messages for global communication
  - Contact messages for customer support

### Real-time Features
- **WebSocket Server**: Integrated with Express for live chat functionality
- **Message Broadcasting**: Real-time message distribution to all connected clients
- **Connection Management**: Automatic client cleanup on disconnect

### Authentication & Authorization
- **Password Security**: bcrypt hashing with configurable salt rounds
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple
- **Role-based Access**: Separate user flows and permissions for workers and employers

### Data Storage Patterns
- **Abstracted Storage Layer**: Interface-based storage implementation for testability
- **Type Safety**: Full TypeScript integration with Zod schema validation
- **Migration Support**: Drizzle Kit for database schema management

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18 with TypeScript, Wouter for routing
- **Build Tools**: Vite with TypeScript support and hot reload
- **Backend**: Express.js with WebSocket support

### Database & ORM
- **Database**: PostgreSQL via Neon Database serverless
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Session Storage**: connect-pg-simple for PostgreSQL session management

### UI & Styling
- **Component Library**: Radix UI primitives for accessible components
- **Design System**: shadcn/ui component collection
- **Styling**: Tailwind CSS with PostCSS and Autoprefixer
- **Icons**: Lucide React for consistent iconography

### Development & Deployment
- **Replit Integration**: Cartographer and dev banner plugins for Replit environment
- **Type Checking**: TypeScript with strict configuration
- **Validation**: Zod for runtime type validation and schema creation

### Real-time Communication
- **WebSockets**: Native WebSocket API with ws library for server implementation
- **State Management**: TanStack Query for server state synchronization

### Security & Authentication
- **Password Hashing**: bcrypt for secure password storage
- **Session Management**: Express sessions with PostgreSQL persistence
- **Form Validation**: React Hook Form with Hookform resolvers for client-side validation