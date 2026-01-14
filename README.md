# ChatStack

A modern, microservices-based real-time chat and social media platform built with Java Spring Boot, NestJS, and Next.js.

## Overview

ChatStack is a full-featured communication platform that combines real-time messaging, user authentication, social posting, and media management. The application uses a containerized microservices architecture for scalability and maintainability.

## Project Structure

```
ChatStack/
├── AuthService/          # Java Spring Boot - Authentication & Authorization
├── chat-service/         # NestJS - Real-time chat and posts
├── email-service/        # NestJS - Email notifications microservice
├── media-service/        # NestJS - Media upload and processing
└── Frontend/             # Next.js - Web application interface
```

---

## 🎯 Implemented Features

### ✅ Authentication Service (AuthService) - COMPLETE
**Technology**: Java Spring Boot 4.0.1 | **Port**: 8080 | **Database**: PostgreSQL

A fully-featured authentication and authorization microservice built with Spring Boot and Spring Security, providing secure user management with JWT token authentication.

**Completed Features**:
- ✅ User registration with email validation
- ✅ Email verification with OTP codes
- ✅ User login with JWT token generation
- ✅ Password reset workflow with OTP
- ✅ OTP resend functionality
- ✅ Profile retrieval (authenticated users)
- ✅ JWT-based token authentication with bearer tokens
- ✅ Spring Security integration
- ✅ BCrypt password hashing and encryption
- ✅ Email-based user management via RabbitMQ
- ✅ Internal microservice APIs for user lookup
- ✅ Batch user retrieval for other services
- ✅ Username/email existence checks
- ✅ CORS configuration for frontend integration
- ✅ Global exception handling
- ✅ Input validation with Jakarta Validation
- ✅ Docker containerization
- ✅ Environment-based configuration

**Public API Endpoints**:
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify` - Email verification with OTP
- `POST /api/auth/login` - User login (returns JWT token)
- `POST /api/auth/forgotPassword` - Password reset request
- `POST /api/auth/resetPassword` - Reset password with OTP
- `POST /api/auth/resendOtp` - Resend verification code
- `GET /api/auth/me` - Get authenticated user profile

**Internal Service-to-Service API**:
- `GET /api/internal/users/{id}` - Get user by ID
- `POST /api/internal/users/batch` - Get multiple users by IDs
- `GET /api/internal/users/exists/username/{username}` - Check username exists
- `GET /api/internal/users/exists/email/{email}` - Check email exists

**Architecture Components**:
- **Controllers**: AuthController, InternalUserController
- **Services**: AuthService (business logic)
- **Security**: JwtUtil, JwtAuthenticationFilter, SecurityConfig
- **Entities**: User (JPA entity with validation)
- **DTOs**: LoginRequest, AuthResponse, UserDto
- **Message Queue**: RabbitMQ integration for email events
- **Exception Handling**: GlobalExceptionHandler

**Security Features**:
- BCrypt password encoding
- JWT token generation and validation
- Protected routes with JWT authentication filter
- Email verification requirement before login
- OTP expiration mechanism
- CORS protection

**Configuration**:
- Environment-based database configuration
- Configurable JWT secret
- PostgreSQL with JPA/Hibernate
- Docker multi-stage build
- RabbitMQ message queue integration

**Documentation**: See [AuthService/Auth_documentation.md](AuthService/Auth_documentation.md)

---

### ✅ Chat Service
**Technology**: NestJS with TypeScript | **Port**: 3333 | **Database**: PostgreSQL | **ORM**: Prisma

**Completed Features**:
- ✅ Real-time chat via WebSockets
- ✅ Message history retrieval
- ✅ Create social posts with title and content
- ✅ Read feed of all posts
- ✅ Update posts (author only)
- ✅ Delete posts (author only)
- ✅ Post-user relationship management
- ✅ JWT authentication guards
- ✅ WebSocket authentication (WsAuth.guard)
- ✅ Message persistence

**WebSocket Events**:
- `send_message` - Send a real-time message
- `receive_message` - Receive incoming messages
- `get_history` - Fetch chat history

**REST Endpoints**:
- `POST /posts` - Create new post (authenticated)
- `GET /posts` - Get all posts with author details
- `PATCH /posts/:id` - Update post (owner only)
- `DELETE /posts/:id` - Delete post (owner only)

**Database Models**:
- `users` - User accounts (linked to AuthService)
- `post` - Social posts with author references
- `message` - Chat messages with timestamps

---

### ✅ Email Service
**Technology**: NestJS with TypeScript | **Message Queue**: RabbitMQ

**Completed Features**:
- ✅ Email microservice with RabbitMQ integration
- ✅ Event-driven email sending
- ✅ OTP email delivery
- ✅ Asynchronous message processing
- ✅ Microservice architecture implementation

---

### ✅ Media Service
**Technology**: NestJS with TypeScript | **Port**: 3004

**Completed Features**:
- ✅ File upload handling
- ✅ Cloudinary integration for media storage
- ✅ Image processing capabilities
- ✅ Media URL generation

---

### ✅ Frontend Application
**Technology**: Next.js 14+ with React & TypeScript | **Port**: 3000 | **Styling**: Tailwind CSS + Radix UI

**Completed Features**:
- ✅ Landing page with marketing content
- ✅ User login interface
- ✅ User registration (registration page structure)
- ✅ Real-time chat interface with WebSocket integration
- ✅ Message history display
- ✅ User authentication context
- ✅ JWT token management
- ✅ Protected routes (authentication required)
- ✅ Responsive design
- ✅ Dark/light theme support
- ✅ Socket.io client integration
- ✅ Navigation components
- ✅ User avatar with initials
- ✅ Message timestamps
- ✅ Auto-scroll to latest messages
- ✅ Keyboard shortcuts (Enter to send)
- ✅ Error handling and loading states

**Pages**:
- `/` - Landing page
- `/login` - Login page
- `/chat` - Real-time chat interface
- `/register` - User registration page

---

## 🛠 Technology Stack

### Backend
- **Spring Boot** 4.0.1 - Java framework for AuthService
- **NestJS** - TypeScript framework for microservices
- **Prisma** - Modern ORM for database operations
- **Spring Security** - Authentication and authorization
- **JWT** - Token-based authentication
- **PostgreSQL** - Primary database
- **RabbitMQ** - Message queue for async communication

### Frontend
- **Next.js** 14+ - React framework with SSR/SSG
- **React** 18+ - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible component library
- **Socket.io** - Real-time communication client

### DevOps & Infrastructure
- **Docker** - Container images for all services
- **Docker Compose** - Service orchestration
- **Cloudinary** - Media hosting and processing

---

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for frontend development)
- Java 17+ (for AuthService development)
- PostgreSQL (if running services locally without Docker)

### Running with Docker Compose

```bash
# Navigate to project root
cd ChatStack

# Start all services
docker-compose up -d

# Services will be available at:
# - AuthService: http://localhost:8080
# - Chat Service: http://localhost:3333
# - Frontend: http://localhost:3000
# - Media Service: http://localhost:3004
```

### Running Services Individually

**AuthService**:
```bash
cd AuthService
./mvnw spring-boot:run
```

**Chat Service**:
```bash
cd chat-service
npm install
npm run start:dev
```

**Frontend**:
```bash
cd Frontend
npm install
npm run dev
```

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  enabled BOOLEAN DEFAULT FALSE,
  verficationCode VARCHAR(255),
  verficationCodeExpiresAt TIMESTAMP
);
```

### Posts Table
```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  content TEXT NOT NULL,
  imageUrl VARCHAR(255),
  authorId BIGINT NOT NULL REFERENCES users(id),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Messages Table
```sql
CREATE TABLE message (
  id SERIAL PRIMARY KEY,
  sender VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 Security Features

- ✅ JWT token-based authentication
- ✅ Password hashing with Spring Security encoder
- ✅ Email verification with OTP
- ✅ Protected API endpoints with authentication guards
- ✅ CORS configuration for trusted origins
- ✅ WebSocket authentication
- ✅ Authorization checks on post updates/deletions

---

## 📝 API Documentation

- **AuthService**: See [AuthService/Auth_documentation.md](AuthService/Auth_documentation.md) for complete endpoint documentation

---

## Environment Configuration

Each service requires specific environment variables. Configure them in respective `.env` files or through Docker environment variables.

### Key Environment Variables
- Database connection strings (PostgreSQL)
- JWT secret keys
- Cloudinary credentials
- RabbitMQ connection URL
- CORS allowed origins
- Email service credentials

---

## 📜 Project Status

- ✅ Authentication and Authorization (Complete)
- ✅ Real-time Chat (Complete)
- ✅ Social Posts (Complete)
- ✅ Email Service (Complete)
- ✅ Media Service (Complete)
- ✅ Frontend UI (Complete)
- ✅ WebSocket Integration (Complete)
- ✅ Docker Containerization (Complete)

---

## 📄 License

This project is part of the ChatStack platform.
