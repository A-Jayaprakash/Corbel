import express from "express";
import {
  recordPaymentController,
  verifyPaymentController,
  getPaymentsForRentBillController,
} from "./payment.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import {
  recordPaymentRules,
  paymentParamRules,
  rentBillParamRules,
} from "./payment.validation.js";
import { validate } from "../../middleware/validate.middleware.js";

const router = express.Router();

/**
 * @route POST /api/v1/rent-bills/:rentBillId/payments
 * @access Protected
 */
router.post(
  "/rent-bills/:rentBillId/payments",
  authMiddleware,
  recordPaymentRules,
  validate,
  recordPaymentController,
);

/**
 * @route GET /api/v1/rent-bills/:rentBillId/payments
 * @access Protected
 */
router.get(
  "/rent-bills/:rentBillId/payments",
  authMiddleware,
  rentBillParamRules,
  validate,
  getPaymentsForRentBillController,
);

/**
 * @route POST /api/v1/payments/:paymentId/verify
 * @access Protected
 */
router.post(
  "/payments/:paymentId/verify",
  authMiddleware,
  paymentParamRules,
  validate,
  verifyPaymentController,
);

export default router;
