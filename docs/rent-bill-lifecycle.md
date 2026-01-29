# Rent Bill Lifecycle & Status Transitions — V1.0.0

## Overview

This document defines the Rent Bill domain and lifecycle for the system.
Rent is modeled as a deterministic, month-based bill tied to a Unit.
This phase introduces rent status tracking and lifecycle transitions without
payment processing.

---

## Core Design Decision

- Rent is tied to Unit + Month
- Rent bills exist independently of tenant changes
- Tenant context is informational, not authoritative for billing
- One rent bill exists per unit per month at most

This ensures deterministic accounting and historical correctness.

---

## Problem Statement

Before this phase:

- Units had tenants but no rent tracking
- No concept of monthly rent obligation
- No way to track due vs paid vs overdue rent
- Billing logic could not be layered safely

This domain establishes rent as a first-class concept.

---

## Rent Bill Entity (V1)

- id
- ownerId
- propertyId
- unitId
- tenantId (nullable, snapshot reference)
- billingMonth (YYYY-MM)
- rentAmount
- status (`DUE`, `PAID`, `OVERDUE`)
- dueDate
- paidAt (nullable)
- createdAt
- updatedAt

---

## Rent Bill Lifecycle

- A rent bill is generated at the start of a month
- Initial status is `DUE`
- If rent is paid, status transitions to `PAID`
- If due date passes without payment, status transitions to `OVERDUE`
- Once marked `PAID`, status never changes again

---

## Status Transitions (Explicit)

- `DUE → PAID`
- `DUE → OVERDUE`
- `OVERDUE → PAID`
- No other transitions are allowed
- Status transitions are enforced at service layer

---

## Monthly Rent Generation Rules

- One rent bill per unit per month
- Rent amount is copied from unit configuration
- Tenant snapshot is recorded if tenant exists
- Rent bills are immutable once created (except status updates)

---

## Business Rules & Constraints

- Duplicate rent bills for the same unit and month are forbidden
- Rent bills cannot be deleted
- Rent amount cannot be edited after creation
- Paid bills are immutable
- Owner scoping is mandatory on all queries
- Unit occupancy does not block bill generation

---

## Authorization & Security

- Owner identity is derived from JWT (`req.owner`)
- ownerId is never accepted from client input
- Rent bill queries are always owner-scoped
- Unit ownership is verified before bill access

---

## API Contracts (V1 Scope)

### Get Rent Bills for a Unit

- GET `/api/v1/units/:unitId/rent-bills`
- Returns rent bills ordered by billingMonth descending

### Get Rent Bill by Month

- GET `/api/v1/units/:unitId/rent-bills/:month`
- Returns rent bill for the specified month

### Mark Rent as Paid

- POST `/api/v1/rent-bills/:rentBillId/pay`
- Transitions status to `PAID`
- Sets paidAt timestamp

---

## Out of Scope (Intentionally)

- Payment gateway integration
- Partial payments
- Refunds
- Discounts or penalties
- Tenant-side access
- Automated schedulers (cron)

These are handled in later phases.

---

## Data Integrity Guarantees

- Rent history is preserved permanently
- No overwriting of past rent data
- Month boundaries are respected strictly
- Status transitions are explicit and auditable

---

## Future Extensions Enabled

- Automated monthly bill generation
- Payment verification workflows
- Rent reminders and notifications
- Financial reports per property/unit
- Multi-tenant SaaS billing support

---

## Related Issues & PRs

- Issue: Domain – Rent bill lifecycle & status transitions
- Depends on:
  - Tenant domain
  - Unit lifecycle enforcement

---

## Status

- This document freezes the scope for the Rent Bill Lifecycle PR
- Any functionality not listed here is explicitly deferred
