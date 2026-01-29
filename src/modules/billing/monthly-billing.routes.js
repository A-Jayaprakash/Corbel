import express from "express";
import { generateMonthlyRentBillsController } from "./monthly-billing.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/v1/billing/generate-monthly-rent
 * @desc    Trigger monthly rent bill generation (idempotent)
 * @access  Protected
 */
router.post(
  "/billing/generate-monthly-rent",
  authMiddleware,
  generateMonthlyRentBillsController,
);

export default router;
