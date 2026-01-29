import express from "express";
import {
  createRentBillController,
  getRentBillsForUnitController,
  getRentBillByMonthController,
  markRentBillAsPaidController,
} from "./rent-bill.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/v1/units/:unitId/rent-bills
 * @desc    Create rent bill for unit + month (idempotent)
 * @access  Protected
 */
router.post(
  "/units/:unitId/rent-bills",
  authMiddleware,
  createRentBillController,
);

/**
 * @route   GET /api/v1/units/:unitId/rent-bills
 * @desc    Get all rent bills for a unit
 * @access  Protected
 */
router.get(
  "/units/:unitId/rent-bills",
  authMiddleware,
  getRentBillsForUnitController,
);

/**
 * @route   GET /api/v1/units/:unitId/rent-bills/:month
 * @desc    Get rent bill for a specific month (YYYY-MM)
 * @access  Protected
 */
router.get(
  "/units/:unitId/rent-bills/:month",
  authMiddleware,
  getRentBillByMonthController,
);

/**
 * @route   POST /api/v1/rent-bills/:rentBillId/pay
 * @desc    Mark rent bill as paid
 * @access  Protected
 */
router.post(
  "/rent-bills/:rentBillId/pay",
  authMiddleware,
  markRentBillAsPaidController,
);

export default router;
