# 🏢 Property & Unit API

> **API contracts for managing properties and units** — V1.0.0

**Module:** Property & Unit Management

---

## 📋 Overview

This document defines **API contracts for managing properties and units** in **V1** of the system.

| Feature             | Status                 |
| ------------------- | ---------------------- |
| Authentication      | ✅ Owner-only          |
| Access Control      | ✅ Protected endpoints |
| Data Scoping        | ✅ Owner-scoped        |
| Tenant/Rent/Billing | ❌ Out of scope (V1)   |

---

## 🔐 Authentication

All endpoints require a valid JWT token in the request header.

### Request Header

```
Authorization: Bearer <access_token>
```

### Error Response (Missing/Invalid Token)

```json
{
  "error": "UNAUTHORIZED"
}
```

---

## 🧱 Domain Rules

> ⚠️ **These rules are enforced at every layer**

- **Owner is derived only from JWT** (`req.owner`)
- **ownerId is NEVER accepted** from request body or params
- **Property deletion blocked** if it has any units
- **Unit deletion blocked** unless status = `VACANT`
- **Cross-owner access strictly forbidden**

---

## 🏢 Property APIs

### 1. Create Property

**POST** `/api/v1/properties`

Creates a new property for the logged-in owner.

#### Request Body

```json
{
  "name": "Green Residency",
  "address": "Bangalore"
}
```

| Field     | Required | Type   | Notes             |
| --------- | -------- | ------ | ----------------- |
| `name`    | ✅ Yes   | string | Property name     |
| `address` | ✅ Yes   | string | Property location |

#### Rules

- `name` is required
- Property is automatically linked to logged-in owner

#### Success Response (201)

```json
{
  "id": "propertyId",
  "name": "Green Residency",
  "address": "Bangalore",
  "createdAt": "2026-02-01T10:00:00Z"
}
```

---

### 2. List Properties

**GET** `/api/v1/properties`

Retrieves all properties owned by the logged-in owner.

#### Rules

- Returns **only** properties owned by logged-in owner
- Owner filtering is automatic via JWT

#### Success Response (200)

```json
[
  {
    "id": "propertyId",
    "name": "Green Residency",
    "address": "Bangalore"
  }
]
```

---

### 3. Delete Property

**DELETE** `/api/v1/properties/:propertyId`

Deletes a property. Property must have zero units.

#### Rules

- Property must belong to owner
- Property must have **zero units** (delete units first)

#### Success Response (200)

```json
{
  "message": "Property deleted successfully"
}
```

#### Error: Property Has Units (409)

```json
{
  "error": "PROPERTY_HAS_UNITS"
}
```

#### Error: Not Found / Not Owned (404)

```json
{
  "error": "PROPERTY_NOT_FOUND"
}
```

---

## 🚪 Unit APIs

### 4. Create Unit

**POST** `/api/v1/properties/:propertyId/units`

Creates a new unit under a property.

#### Request Body

```json
{
  "unitName": "A-101",
  "monthlyRent": 15000,
  "advanceAmount": 50000
}
```

| Field           | Required | Type   | Notes               |
| --------------- | -------- | ------ | ------------------- |
| `unitName`      | ✅ Yes   | string | Unit identifier     |
| `monthlyRent`   | ✅ Yes   | number | Monthly rent amount |
| `advanceAmount` | ✅ Yes   | number | Advance deposit     |

#### Rules

- Property must belong to owner
- Unit status defaults to `VACANT`

#### Success Response (201)

```json
{
  "id": "unitId",
  "unitName": "A-101",
  "monthlyRent": 15000,
  "advanceAmount": 50000,
  "status": "VACANT"
}
```

---

### 5. List Units Under Property

**GET** `/api/v1/properties/:propertyId/units`

Retrieves all units under a property.

#### Rules

- Property must belong to owner
- Returns all units for that property

#### Success Response (200)

```json
[
  {
    "id": "unitId",
    "unitName": "A-101",
    "monthlyRent": 15000,
    "advanceAmount": 50000,
    "status": "VACANT"
  }
]
```

---

### 6. Delete Unit

**DELETE** `/api/v1/units/:unitId`

Deletes a unit. Unit must be vacant.

#### Rules

- Unit must belong to owner
- Unit status must be `VACANT`

#### Success Response (200)

```json
{
  "message": "Unit deleted successfully"
}
```

#### Error: Unit Occupied (409)

```json
{
  "error": "UNIT_NOT_VACANT"
}
```

#### Error: Not Found / Not Owned (404)

```json
{
  "error": "UNIT_NOT_FOUND"
}
```

---

## 🚫 Out of Scope (V1)

The following features are **planned for future phases**:

- [ ] Tenant assignment
- [ ] Rent tracking
- [ ] Billing system
- [ ] Payment processing
- [ ] Document management
- [ ] Soft deletes

---

## ✅ Definition of Done (PR #4)

- [x] Owner can manage properties
- [x] Owner can manage units under properties
- [x] Ownership is enforced at every layer
- [x] Invalid deletions are blocked explicitly
- [x] APIs follow consistent error contracts

---

## 🧠 Design Notes

### Property Management

- **Property deletion** is blocked if units exist
- Simple `address` field used in V1 (object planned for V2)

### Unit Management

- **Unit deletion** is blocked if occupied (status ≠ `VACANT`)
- Unit status defaults to `VACANT`

### Security & Scoping

- Owner scoping is enforced via JWT, **not** client input
- Cross-owner access is impossible by design

---

## 📊 API Summary

| Endpoint                       | Method | Purpose         | Key Rules                    |
| ------------------------------ | ------ | --------------- | ---------------------------- |
| `/api/v1/properties`           | POST   | Create property | Name required, owner-derived |
| `/api/v1/properties`           | GET    | List properties | Owner-filtered only          |
| `/api/v1/properties/:id`       | DELETE | Delete property | Zero units required          |
| `/api/v1/properties/:id/units` | POST   | Create unit     | Status = VACANT default      |
| `/api/v1/properties/:id/units` | GET    | List units      | Owner-filtered only          |
| `/api/v1/units/:id`            | DELETE | Delete unit     | VACANT status required       |

---

**Version:** V1.0.0  
**Last Updated:** February 2026  
**Status:** In Development (PR #4)

```

```
