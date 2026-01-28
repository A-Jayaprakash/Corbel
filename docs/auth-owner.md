# 🔐 Auth – Owner Module (V1.0.0)

> This finalizes DB schema + Auth API contracts for V1.0.0, aligned with a MERN stack (MongoDB + Express + Node).
>
> This is interview-safe, production-grade, and scope-locked.

## Tech Stack

- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Auth:** bcrypt + JWT
- **API Style:** REST
- **Scope:** Owner-only authentication

---

## 🎯 Purpose

This module implements **authentication for Owner**, the **only authenticated user** in V1.

It establishes:

- Secure identity
- Access boundary for all future domain operations
- A clean foundation for unit, tenant, billing, and document modules

## 🚫 Explicitly Out of Scope (V1)

- OAuth2 / Social login
- Refresh tokens
- Logout endpoint
- Password reset / OTP
- Tenant authentication
- Multiple owners per account

> These are **intentionally deferred to V2+**.

---

## 🧱 Database Schema (MongoDB – Mongoose)

### Collection: `owners`

This collection stores **only identity & security-critical data**.

```javascript
Owner {
  _id: ObjectId,

  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },

  mobileNumber: {
    type: String,
    unique: true,
    sparse: true   // allows multiple nulls
  },

  passwordHash: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### 🔒 Schema Design Rationale

- No profile fields (gender, age, etc.) in auth
- Password stored only as bcrypt hash
- `email` is the primary login identifier
- `mobileNumber` is optional (future-proof for alerts / OTP)
- Timestamps support auditing & debugging

### 🔐 Password Hashing Policy

- **Algorithm:** bcrypt
- **Salt rounds:** 10–12
- **Hash performed:** server-side only
- **Never re-hash** an existing hash

### 🔑 JWT Design

#### JWT Payload

```json
{
  "owner_id": "<ObjectId>",
  "email": "owner@example.com"
}
```

#### JWT Rules

- No sensitive data in token
- Signed with secret from environment variable
- Token expiry enforced (e.g., 1 hour)

---

## 📌 API Base Path

`/api/v1/auth`

---

## 1️⃣ Register Owner

### Endpoint

```
POST /api/v1/auth/register
```

### Request Body

```json
{
  "name": "Jayaprakash",
  "email": "jp@example.com",
  "password": "StrongPassword@123",
  "mobileNumber": "9876543210"
}
```

### Validation Rules

- `name`: required, min 2 chars
- `email`: required, valid format, unique
- `password`: required, min 8 chars
- `mobileNumber`: optional, unique if present

### Success Response (201 Created)

```json
{
  "message": "Owner registered successfully"
}
```

> **Note:** No auto-login in V1.

### Error Responses

#### 409 – Email already exists

```json
{
  "error": "EMAIL_ALREADY_EXISTS"
}
```

#### 400 – Validation error

```json
{
  "error": "INVALID_INPUT",
  "details": {
    "email": "Invalid email format"
  }
}
```

---

## 2️⃣ Owner Login

### Endpoint

```
POST /api/v1/auth/login
```

### Request Body

```json
{
  "email": "jp@example.com",
  "password": "StrongPassword@123"
}
```

### Success Response (200 OK)

```json
{
  "access_token": "<JWT_TOKEN>",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### Error Responses

#### 401 – Invalid credentials

```json
{
  "error": "INVALID_CREDENTIALS"
}
```

#### 400 – Missing fields

```json
{
  "error": "INVALID_INPUT"
}
```

---

## 3️⃣ Authentication Middleware (Internal Contract)

### Required Header

```
Authorization: Bearer <access_token>
```

### Middleware Responsibilities

- Verify JWT signature
- Validate token expiration
- Extract owner identity
- Attach owner context to request

### Request Context Object

```javascript
req.owner = {
  id: "<ObjectId>",
  email: "owner@example.com",
};
```

### Failure Response (401 Unauthorized)

```json
{
  "error": "UNAUTHORIZED"
}
```

---

## 🧪 Edge Cases to Handle

- Email normalization (lowercase)
- Duplicate mobile numbers
- Invalid / expired JWT
- Consistent error messages (no info leakage)

---

## ✅ Definition of Done

- Owner can register
- Owner can log in
- Passwords are bcrypt-hashed
- JWT protects routes
- Owner context is reliable for all downstream modules

---

## 🔥 Why This Design

- Minimal surface area → fewer security bugs
- Clear separation of concerns
- Interview-safe architectural decisions
- Easy to extend in V2 (OAuth2, tenant auth, SaaS)

---

## Status

✅ **Finalized & Approved for V1.0.0**
