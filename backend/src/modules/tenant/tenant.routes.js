import express from "express";
import {
  assignTenantToUnitController,
  getActiveTenantForUnitController,
  removeTenantFromUnitController,
} from "./tenant.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/v1/units/:unitId/tenant
 * @desc    Assign tenant to a unit
 * @access  Protected
 */
router.post(
  "/units/:unitId/tenant",
  authMiddleware,
  assignTenantToUnitController,
);

/**
 * @route   GET /api/v1/units/:unitId/tenant
 * @desc    Get active tenant for a unit
 * @access  Protected
 */
router.get(
  "/units/:unitId/tenant",
  authMiddleware,
  getActiveTenantForUnitController,
);

/**
 * @route   DELETE /api/v1/units/:unitId/tenant
 * @desc    Remove (exit) tenant from a unit
 * @access  Protected
 */
router.delete(
  "/units/:unitId/tenant",
  authMiddleware,
  removeTenantFromUnitController,
);

export default router;
