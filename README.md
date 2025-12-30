# ChatStack Project Documentation

## Overview

ChatStack is a microservices-based chat application that provides real-time messaging, user authentication, media sharing, and social features. The project is built using a combination of Java Spring Boot, NestJS, and Next.js technologies.

## Architecture

The application follows a microservices architecture with the following components:

- **AuthService**: Handles user authentication and authorization
- **Chat Service**: Manages real-time chat functionality and posts
- **Media Service**: Handles file uploads and media processing
- **Frontend**: Web application interface
- **User Service**: User management and profiles (in development)

All services are containerized using Docker and orchestrated with Docker Compose.

## Services

### AuthService
- **Technology**: Java Spring Boot
- **Port**: 8080
- **Database**: PostgreSQL
- **Features**:
  - User registration and login
  - JWT token-based authentication
  - Password encryption
  - User session management

### Chat Service
- **Technology**: NestJS with TypeScript
- **Port**: 3333
- **Database**: PostgreSQL (shared with AuthService)
- **Features**:
  - Real-time chat via WebSockets
  - Post creation and management
  - JWT authentication for API endpoints
  - Prisma ORM for database operations

### Media Service
- **Technology**: NestJS with TypeScript
- **Port**: 3004
- **Features**:
  - File upload handling
  - Cloudinary integration for media storage
  - Image and media processing

### Frontend
- **Technology**: Next.js with React and TypeScript
- **Port**: 3000
- **Features**:
  - User authentication UI
  - Real-time chat interface
  - Responsive design with Tailwind CSS
  - Socket.io client for WebSocket connections
  - Dark/light theme support

## Key Features

- **Authentication**: Secure user login/registration with JWT tokens
- **Real-time Chat**: WebSocket-based messaging
- **Media Sharing**: Upload and share images/files
- **Social Posts**: Create and interact with posts
- **Responsive UI**: Modern web interface with theme support

## Technologies Used

- **Backend**: Java Spring Boot, NestJS
- **Frontend**: Next.js, React, TypeScript
- **Database**: PostgreSQL
- **ORM**: JPA (AuthService), Prisma (Chat Service)
- **Authentication**: JWT, Spring Security
- **Real-time**: Socket.io
- **Media Storage**: Cloudinary
- **Styling**: Tailwind CSS, Radix UI
- **Containerization**: Docker, Docker Compose

## Development Status

- ✅ AuthService: Basic authentication implemented
- ✅ Chat Service: Real-time chat and posts implemented
- ✅ Media Service: File upload with Cloudinary
- ✅ Frontend: Basic UI with chat and login

## API Endpoints

### AuthService (Port 8080)
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Chat Service (Port 3333)
- `GET /posts` - Get all posts
- `POST /posts` - Create new post
- WebSocket: Real-time chat events

### Media Service (Port 3004)
- `POST /media/upload` - Upload media files
