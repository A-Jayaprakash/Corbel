# Monthly Rent Bill Generation — V1.0.0

## Overview

This document defines the logic for automatic monthly rent bill generation.
The goal is to generate rent bills for all eligible units at the start of a month
in a deterministic, idempotent, and failure-safe manner.

This phase builds on the Rent Bill Lifecycle domain.

---

## Problem Statement

Before this phase:

- Rent bills could only be created manually
- There was no system-level monthly billing trigger
- Risk of missing bills for some units
- No guarantee against duplicate bill creation

This phase introduces a controlled mechanism to generate monthly rent bills
reliably for all units.

---

## Core Design Principles

- Monthly generation must be idempotent
- Running the generator multiple times must be safe
- No duplicate rent bills may be created
- Billing must not depend on tenant actions
- Failures should not corrupt billing state

---

## Eligibility Rules for Bill Generation

- Rent bills are generated per unit
- Unit must belong to an owner
- Unit must have a configured monthlyRent
- Unit status does not block bill generation
- Units without tenants are still billed
- One bill per unit per month is allowed

---

## Billing Month Determination

- Billing month is derived from system date
- Format used: YYYY-MM
- Month boundaries are respected strictly
- No backdated or future bills in V1

---

## Bill Generation Flow

- Determine current billing month
- Fetch all units in the system
- For each unit:
  - Check if rent bill already exists for that month
  - If exists, skip
  - If not, create rent bill with status `DUE`
- Bill creation uses existing rent bill service logic

---

## Idempotency Guarantees

- Unit + Month uniqueness enforced at DB level
- Service-level existence check before creation
- Generator can be run multiple times safely
- Partial failures do not corrupt state

---

## Execution Strategy (V1)

- Bill generation is triggered manually or via API
- No cron or scheduler is implemented in V1
- API-based trigger allows controlled execution
- Cron integration is deferred intentionally

---

## API Contract (V1 Scope)

### Trigger Monthly Rent Bill Generation

- POST `/api/v1/billing/generate-monthly-rent`
- Generates rent bills for the current month
- Safe to call multiple times

### Response

- Total units processed
- Number of bills created
- Number of units skipped

---

## Business Rules & Constraints

- Rent bills cannot be deleted
- Rent amount is copied from unit at generation time
- Tenant snapshot is captured if tenant exists
- Generated bills default to status `DUE`
- Generated bills are immutable except status

---

## Authorization & Security

- Endpoint is owner-protected (admin-level in V1)
- Owner identity derived from JWT
- No client input accepted for billing month
- All operations are owner-scoped

---

## Failure Handling

- If bill creation fails for one unit, others continue
- Errors are logged but do not halt generation
- Duplicate key errors are safely ignored

---

## Out of Scope (Intentionally)

- Cron jobs or schedulers
- Backdated bill generation
- Future month bill generation
- Overdue auto-marking
- Payment gateway integration

These are handled in later phases.

---

## Data Integrity Guarantees

- No duplicate monthly bills
- Rent history remains complete
- Running generator twice does not change state
- Partial execution does not corrupt billing data

---

## Future Extensions Enabled

- Cron-based automatic monthly billing
- Owner-specific billing schedules
- Retry mechanisms
- Overdue detection jobs
- Notification triggers

---

## Related Issues & PRs

- Issue: Billing – Monthly rent bill generation
- Depends on:
  - Rent bill lifecycle & status transitions
  - Unit domain & rent configuration

---

## Status

- This document freezes the scope for the Monthly Rent Bill Generation PR
- Any behavior not listed here is explicitly deferred
