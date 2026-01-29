# Payments: Rent Payment Recording & Verification — V1.0.0

## Overview

This document defines the Payments domain for recording and verifying rent
payments against rent bills. The focus of this phase is **recording truth**,
not moving money.

Payments are modeled as immutable records that transition rent bills to `PAID`
in a controlled and auditable way.

---

## Problem Statement

Before this phase:

- Rent bills could be marked as paid without payment context
- No audit trail existed for payments
- No way to reconcile bills with actual payments
- No protection against duplicate or invalid payments

This domain introduces payment records as a first-class concept.

---

## Core Design Principles

- Payments are append-only records
- Rent bills are authoritative for status
- Payments transition bills, not vice versa
- No payment record is ever deleted
- Verification is explicit and auditable

---

## Payment Entity (V1)

- id
- ownerId
- propertyId
- unitId
- tenantId (nullable, snapshot)
- rentBillId
- amount
- method (`CASH`, `UPI`, `BANK_TRANSFER`)
- reference (nullable)
- status (`RECORDED`, `VERIFIED`)
- paidAt
- createdAt
- updatedAt

---

## Payment Lifecycle

- Payment is initially created with status `RECORDED`
- Payment may be manually verified by the owner
- Upon verification:
  - Payment status transitions to `VERIFIED`
  - Associated rent bill transitions to `PAID`
- Verified payments are immutable

---

## Rent Bill Interaction Rules

- A payment must always reference a rent bill
- Payment amount must match rent bill amount (V1 strict)
- Only one verified payment is allowed per rent bill
- Multiple recorded payments are allowed but only one can be verified
- Rent bill status changes only via payment verification

---

## API Contracts (V1 Scope)

### Record Payment for Rent Bill

- POST `/api/v1/rent-bills/:rentBillId/payments`
- Records a payment attempt
- Does not mark bill as paid

### Verify Payment

- POST `/api/v1/payments/:paymentId/verify`
- Verifies payment
- Transitions rent bill to `PAID`

### Get Payments for Rent Bill

- GET `/api/v1/rent-bills/:rentBillId/payments`
- Returns all payment records for the bill

---

## Business Rules & Constraints

- Payment amount must equal rent bill amount
- Verified payment is terminal
- Rent bill cannot be paid twice
- Payment verification is idempotent
- Payments cannot be edited or deleted
- Owner scoping is mandatory on all queries

---

## Authorization & Security

- Owner identity derived from JWT (`req.owner`)
- ownerId is never accepted from client input
- Payment access is validated via rent bill ownership
- Cross-owner payment access is forbidden

---

## Failure & Consistency Handling

- Recording a payment does not change bill status
- Verification failure does not corrupt bill state
- Duplicate verification attempts are safely ignored
- Partial failures do not create inconsistent states

---

## Out of Scope (Intentionally)

- Payment gateway integration
- Automatic verification
- Partial payments
- Refunds
- Overpayments
- Tenant-side payment actions

These are deferred to later phases.

---

## Data Integrity Guarantees

- Payment history is preserved permanently
- Rent bills transition to `PAID` only once
- Verified payments are immutable
- Financial audit trail is complete

---

## Future Extensions Enabled

- Online payment gateways
- Partial and split payments
- Refund workflows
- Payment reconciliation
- Tenant-facing payment UI
- Financial reporting

---

## Related Issues & PRs

- Issue: Payments – Rent payment recording & verification
- Depends on:
  - Rent bill lifecycle & status transitions
  - Monthly rent bill generation

---

## Status

- This document freezes the scope for the Payments PR
- Any behavior not listed here is explicitly deferred
