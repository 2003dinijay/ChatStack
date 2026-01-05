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
- **Database:** Database (as configured in application.properties)
- **Security:** Spring Security with JWT
- **Validation:** Jakarta Validation API
- **ORM:** Spring Data JPA with Hibernate

---

## Configuration

The service is configured via `application.properties` in `src/main/resources/`. Key configurations include:
- Database connection details
- JWT secret key and expiration settings
- Email service configuration for OTP delivery
- CORS settings (currently allows `http://localhost:3000`)

---

## Notes

- All timestamps are in ISO 8601 format
- Passwords are hashed using Spring Security's password encoder
- OTP codes have an expiration time (configurable)
- JWT tokens have a configurable expiration time
- Email verification is required before a user can log in
