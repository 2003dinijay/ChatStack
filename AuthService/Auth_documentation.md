# AuthService API Documentation

## Overview
The AuthService is a Spring Boot application that provides authentication and authorization services for the ChatStack platform. It handles user registration, email verification, password management, and JWT-based authentication.

**Base URL:** `http://localhost:8080/api/auth`

**CORS Configuration:** Allows requests from `http://localhost:3000`

---

## Table of Contents
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [User Registration](#user-registration)
  - [Email Verification](#email-verification)
  - [OTP Management](#otp-management)
  - [Password Recovery](#password-recovery)
  - [Login](#login)
  - [User Profile](#user-profile)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Status Codes](#status-codes)

---

## Authentication

The AuthService uses **JWT (JSON Web Token)** based authentication. After successful login, clients receive a token that must be included in the `Authorization` header for subsequent authenticated requests:

```
Authorization: Bearer <token>
```

---

## API Endpoints

### User Registration

#### POST `/register`
Register a new user account.

**Request Body:**
```json
{
  "username": "string (3-20 characters, unique)",
  "email": "string (valid email format, unique)",
  "password": "string (minimum 8 characters)"
}
```

**Response (200 OK):**
```json
{
  "id": "number",
  "username": "string",
  "email": "string",
  "enabled": false,
  "verficationCode": "string",
  "verficationCodeExpiresAt": "ISO 8601 datetime"
}
```

**Error Response (400 Bad Request):**
```json
{
  "Error": "error message"
}
```

**Validation Rules:**
- Username: Required, 3-20 characters, must be unique
- Email: Required, valid email format, must be unique
- Password: Required, minimum 8 characters

---

### Email Verification

#### POST `/verify`
Verify user email address using OTP code sent during registration.

**Request Body:**
```json
{
  "email": "string (user's email)",
  "code": "string (OTP code)"
}
```

**Response (200 OK):**
```json
{
  "message": "User verified successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "Error": "Invalid verification code or email"
}
```

**Note:** Users must verify their email before they can log in.

---

### OTP Management

#### POST `/resendOtp`
Request a new OTP code to be sent to the user's email address.

**Request Body:**
```json
{
  "email": "string (user's email)"
}
```

**Response (200 OK):**
```json
{
  "message": "New OTP sent to your email successfully"
}
```

**Use Cases:**
- User didn't receive the initial OTP
- OTP has expired
- User wants to re-verify their email

---

### Password Recovery

#### POST `/forgotPassword`
Request a password reset OTP to be sent to the user's email address.

**Request Body:**
```json
{
  "email": "string (user's registered email)"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset OTP sent to your email successfully"
}
```

---

#### POST `/resetPassword`
Reset user password using the OTP code from email.

**Request Body:**
```json
{
  "email": "string (user's email)",
  "code": "string (OTP code from email)",
  "newPassword": "string (minimum 8 characters)"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "Error": "error message"
}
```

**Validation Rules:**
- New password must be at least 8 characters long
- OTP code must be valid and not expired

---

### Login

#### POST `/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200 OK):**
```json
{
  "token": "JWT token string",
  "id": "number",
  "username": "string",
  "email": "string"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "Error": "Invalid username or password"
}
```

**Conditions for Success:**
- User must be registered
- User must have verified their email
- Username and password must be correct

---

### User Profile

#### GET `/me`
Retrieve the authenticated user's profile information.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "id": "number",
  "username": "string"
}
```

**Error Response (401 Unauthorized):**
```
Unauthorized
```

**Error Response (404 Not Found):**
```json
{
  "error": "User not found"
}
```

**Note:** The password hash is not included in the response for security reasons.

---

## Data Models

### User Entity
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Long | Primary Key, Auto-generated | Unique user identifier |
| username | String | Unique, Not Null, 3-20 chars | User's login username |
| password | String | Not Null, Min 8 chars | Hashed password |
| email | String | Unique, Not Null, Valid Email | User's email address |
| enabled | Boolean | Default: false | Account activation status |
| verficationCode | String | Nullable | Current OTP code |
| verficationCodeExpiresAt | LocalDateTime | Nullable | OTP expiration timestamp |

### AuthResponse
Response DTO returned on successful login.
| Field | Type | Description |
|-------|------|-------------|
| token | String | JWT authentication token |
| id | Long | User ID |
| username | String | Username |
| email | String | Email address |

### LoginRequest
| Field | Type | Description |
|-------|------|-------------|
| username | String | User's login username |
| password | String | User's password |

---

## Error Handling

All error responses follow a consistent format:

```json
{
  "Error": "Description of what went wrong"
}
```

### Common Error Messages
| Message | Cause | HTTP Status |
|---------|-------|------------|
| Invalid verification code or email | Incorrect OTP or email address | 400 |
| Invalid username or password | Wrong credentials during login | 401 |
| Username already exists | Username is taken | 400 |
| Email already exists | Email is already registered | 400 |
| User not found | User ID doesn't exist | 404 |
| Unauthorized | Missing or invalid JWT token | 401 |

---

## Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful request |
| 400 | Bad Request | Invalid input data, validation errors |
| 401 | Unauthorized | Missing/invalid token, wrong credentials |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server-side error |

---

## Request/Response Examples

### Example 1: Complete Registration Flow

**Step 1: Register**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Step 2: Verify Email**
```bash
curl -X POST http://localhost:8080/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "code": "123456"
  }'
```

**Step 3: Login**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "SecurePass123"
  }'
```

### Example 2: Password Recovery Flow

**Step 1: Request Password Reset**
```bash
curl -X POST http://localhost:8080/api/auth/forgotPassword \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

**Step 2: Reset Password**
```bash
curl -X POST http://localhost:8080/api/auth/resetPassword \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "code": "123456",
    "newPassword": "NewSecurePass456"
  }'
```

### Example 3: Accessing Protected Resource

```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Technology Stack

- **Framework:** Spring Boot 4.0.1
- **Language:** Java 17
- **Database:** PostgreSQL
- **Security:** Spring Security with JWT
- **Validation:** Jakarta Validation API
- **ORM:** Spring Data JPA with Hibernate
- **Message Queue:** RabbitMQ (for email service integration)
- **Password Encoding:** BCryptPasswordEncoder

---

## Architecture & Components

### Core Components

#### Controllers
1. **AuthController** (`/api/auth/*`)
   - Handles all public authentication endpoints
   - User registration, verification, login, password recovery
   - CORS enabled for `http://localhost:3000`

2. **InternalUserController** (`/api/internal/users/*`)
   - Internal API for service-to-service communication
   - Provides user lookup by ID and batch operations
   - Username/email existence checks
   - Should be restricted to internal network in production

#### Services
- **AuthService**: Business logic for authentication operations
  - User registration with OTP generation
  - Email verification
  - Password reset workflow
  - OTP resend functionality
  - JWT token generation

#### Security Components
- **JwtUtil**: JWT token generation and validation
- **JwtAuthenticationFilter**: Intercepts and validates JWT tokens
- **SecurityConfig**: Spring Security configuration with JWT integration
- **GlobalExceptionHandler**: Centralized exception handling

#### Entities
- **User**: JPA entity with validation annotations
  - Email and username uniqueness constraints
  - Password hashing on save
  - OTP code management with expiration

#### DTOs
- **LoginRequest**: Login credentials DTO
- **AuthResponse**: Login response with JWT token
- **UserDto**: User data transfer object (excludes sensitive information)

---

## Internal API Endpoints

### GET `/api/internal/users/{id}`
Get user information by ID (for microservice communication).

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com"
}
```

### POST `/api/internal/users/batch`
Get multiple users by IDs in batch.

**Request Body:**
```json
{
  "ids": [1, 2, 3]
}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  },
  {
    "id": 2,
    "username": "janedoe",
    "email": "jane@example.com"
  }
]
```

### GET `/api/internal/users/exists/username/{username}`
Check if username exists.

**Response (200 OK):**
```json
{
  "exists": true
}
```

### GET `/api/internal/users/exists/email/{email}`
Check if email exists.

**Response (200 OK):**
```json
{
  "exists": false
}
```

---

## Configuration

The service is configured via `application.properties` in `src/main/resources/`. Key configurations include:

### Database Configuration
```properties
spring.datasource.url=jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:auth_db}
spring.datasource.username=${DB_USER:user}
spring.datasource.password=${DB_PASSWORD:password}
spring.datasource.driver-class-name=org.postgresql.Driver
```

### JPA/Hibernate Configuration
```properties
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### JWT Configuration
```properties
jwt.secret=${JWT_SECRET:a_very_long_random_string_for_local_development_only}
```

### Environment Variables
- `DB_HOST`: Database host (default: localhost)
- `DB_PORT`: Database port (default: 5432)
- `DB_NAME`: Database name (default: auth_db)
- `DB_USER`: Database username (default: user)
- `DB_PASSWORD`: Database password (default: password)
- `JWT_SECRET`: JWT signing secret key

---

## Security Features

### Password Security
- Passwords are hashed using BCryptPasswordEncoder
- Plain text passwords are never stored
- Password strength requirements: minimum 8 characters

### JWT Token Authentication
- JWT tokens generated on successful login
- Token contains username claim
- Token expiration configurable
- Tokens validated on protected endpoints

### Email Verification
- OTP codes sent via RabbitMQ to email service
- OTP expiration implemented
- Users must verify email before login

### CORS Configuration
- Configured to allow requests from frontend (`http://localhost:3000`)
- Customizable for production environments

### Authorization
- Protected endpoints require valid JWT token
- `/api/auth/me` requires authentication
- Internal APIs should be restricted to service network

---

## Docker Support

### Dockerfile
The service includes a multi-stage Dockerfile for optimized builds:
- Build stage: Compiles Java application with Maven
- Runtime stage: Runs the application with JRE 17

### Docker Compose Integration
The service is configured in the main `docker-compose.yml`:
- Port: 8080
- PostgreSQL database dependency
- RabbitMQ connection for email service
- Environment variables for database and JWT

---

## RabbitMQ Integration

The AuthService publishes email events to RabbitMQ for asynchronous email delivery:
- **Queue**: `email_queue`
- **Exchange**: Direct exchange
- **Events**: OTP emails, password reset emails, verification emails

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    enabled BOOLEAN DEFAULT FALSE,
    verfication_code VARCHAR(255),
    verfication_code_expires_at TIMESTAMP
);
```

**Indexes**:
- Primary key on `id`
- Unique constraint on `username`
- Unique constraint on `email`

---

## Testing

The service includes test configuration:
- Spring Boot Test dependencies
- Security test support
- Data JPA test support
- WebMVC test support

---

## Deployment

### Local Development
```bash
cd AuthService
./mvnw spring-boot:run
```

### Docker Deployment
```bash
# Build image
docker build -t chatstack-auth .

# Run container
docker run -p 8080:8080 \
  -e DB_HOST=postgres \
  -e DB_NAME=auth_db \
  -e JWT_SECRET=your_secret \
  chatstack-auth
```

### Production Considerations
- Set strong JWT secret via environment variable
- Configure database connection pooling
- Enable HTTPS/TLS
- Restrict internal API endpoints to service network
- Configure proper logging and monitoring
- Set up database backups
- Use secrets management for credentials

---

## Notes

- All timestamps are in ISO 8601 format
- Passwords are hashed using BCryptPasswordEncoder with Spring Security
- OTP codes have an expiration time (configurable)
- JWT tokens have a configurable expiration time
- Email verification is required before a user can log in
- Internal APIs should not be publicly accessible in production
- The service uses environment variables for configuration flexibility
