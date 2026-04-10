import express from "express";
import {
  createRentBillController,
  getRentBillsForUnitController,
  getRentBillByMonthController,
  markRentBillAsPaidController,
} from "./rent-bill.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import {
  createRentBillRules,
  rentBillParamRules,
  monthParamRules,
} from "./rent-bill.validation.js";
import { validate } from "../../middleware/validate.middleware.js";

const router = express.Router();

/**
 * @route POST /api/v1/units/:unitId/rent-bills
 * @access Protected
 */
router.post(
  "/units/:unitId/rent-bills",
  authMiddleware,
  createRentBillRules,
  validate,
  createRentBillController,
);

/**
 * @route GET /api/v1/units/:unitId/rent-bills
 * @access Protected
 */
router.get(
  "/units/:unitId/rent-bills",
  authMiddleware,
  getRentBillsForUnitController,
);

/**
 * @route GET /api/v1/units/:unitId/rent-bills/:month
 * @access Protected
 */
router.get(
  "/units/:unitId/rent-bills/:month",
  authMiddleware,
  monthParamRules,
  validate,
  getRentBillByMonthController,
);

/**
 * @route POST /api/v1/rent-bills/:rentBillId/pay
 * @access Protected
 */
router.post(
  "/rent-bills/:rentBillId/pay",
  authMiddleware,
  rentBillParamRules,
  validate,
  markRentBillAsPaidController,
);

export default router;
