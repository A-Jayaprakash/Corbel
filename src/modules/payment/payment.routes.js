import express from "express";
import {
  recordPaymentController,
  verifyPaymentController,
  getPaymentsForRentBillController,
} from "./payment.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/v1/rent-bills/:rentBillId/payments
 * @desc    Record a payment for a rent bill
 * @access  Protected
 */
router.post(
  "/rent-bills/:rentBillId/payments",
  authMiddleware,
  recordPaymentController,
);

/**
 * @route   GET /api/v1/rent-bills/:rentBillId/payments
 * @desc    Get all payments for a rent bill
 * @access  Protected
 */
router.get(
  "/rent-bills/:rentBillId/payments",
  authMiddleware,
  getPaymentsForRentBillController,
);

/**
 * @route   POST /api/v1/payments/:paymentId/verify
 * @desc    Verify a payment and mark rent bill as PAID
 * @access  Protected
 */
router.post(
  "/payments/:paymentId/verify",
  authMiddleware,
  verifyPaymentController,
);

export default router;
