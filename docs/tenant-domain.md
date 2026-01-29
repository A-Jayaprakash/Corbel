# Tenant Domain & Assignment — V1.0.0

## Overview

This document describes the Tenant domain and assignment logic introduced in this phase.
The goal is to allow an owner to assign tenants to units, manage tenant lifecycle, and
transition unit occupancy states in a controlled and auditable manner.

This phase builds directly on the Property and Unit foundations.

---

## Problem Statement

Before this phase:

- Units existed independently without tenant context
- Unit occupancy state was static (`VACANT`)
- No structured way to store tenant information
- No lifecycle for tenant entry and exit

This PR introduces tenant assignment as a **domain concept**, not just a data record.

---

## Domain Model

- Tenant is a managed entity, not an authenticated user
- Tenant belongs to exactly one Unit at a time
- Unit can have at most one active Tenant
- Tenant lifecycle is explicit and auditable
- Unit status transitions are driven by tenant assignment

---

## Tenant Entity (V1)

- id
- ownerId
- propertyId
- unitId
- name
- phone
- email (optional)
- tenancyStartDate
- tenancyEndDate (nullable)
- status (`ACTIVE`, `EXITED`)
- createdAt
- updatedAt

---

## Unit Lifecycle Impact

- When a tenant is assigned to a unit:
  - Unit status transitions from `VACANT` → `OCCUPIED`
- When a tenant exits:
  - Unit status transitions from `OCCUPIED` → `VACANT`
- Unit deletion remains blocked while status is `OCCUPIED`

---

## API Contracts

### Assign Tenant to Unit

- POST `/api/v1/units/:unitId/tenant`
- Assigns a tenant to a vacant unit
- Sets unit status to `OCCUPIED`
- Creates a new tenant record with status `ACTIVE`

### Get Tenant for Unit

- GET `/api/v1/units/:unitId/tenant`
- Returns the currently active tenant for the unit
- Returns empty response if unit is vacant

### Remove Tenant from Unit

- DELETE `/api/v1/units/:unitId/tenant`
- Marks tenant status as `EXITED`
- Sets tenancyEndDate
- Transitions unit status back to `VACANT`

---

## Business Rules & Constraints

- Tenant assignment is allowed only if unit status is `VACANT`
- Only one active tenant per unit is allowed
- Tenant records are never hard-deleted
- Tenant exit is a state transition, not a deletion
- Unit occupancy state must always reflect tenant presence
- All tenant operations are owner-scoped

---

## Authorization & Security

- Owner identity is derived exclusively from JWT (`req.owner`)
- ownerId is never accepted from request body or params
- Tenant queries always include ownerId constraint
- Cross-owner tenant access is impossible
- Unit ownership is verified before tenant operations

---

## Out of Scope (Intentionally)

- Tenant authentication or login
- Multiple tenants per unit
- Co-tenancy or sharing
- Rent billing
- Payment integration
- Document uploads

These concerns are handled in later phases.

---

## Data Integrity Guarantees

- Tenant history is preserved for auditing
- Unit state cannot become inconsistent with tenant state
- Invalid state transitions are explicitly blocked
- No cascading deletes are performed

---

## Future Extensions Enabled

- Monthly rent bill generation per active tenant
- Tenant-specific document storage
- Tenant notification system
- Historical tenant reports per unit
- Multi-tenant SaaS extension

---

## Related Issues & PRs

- Issue: Domain – Tenant assignment & lifecycle
- Depends on:
  - Domain: Property & Unit entities
  - Property & Unit APIs with lifecycle enforcement

---

## Status

- This document defines the frozen scope for the Tenant Domain PR
- Any functionality not listed here is explicitly deferred
