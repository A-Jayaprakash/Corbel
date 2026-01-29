import express from "express";
import {
  createUnitController,
  getUnitsByPropertyController,
  deleteUnitController,
} from "./unit.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/v1/properties/:propertyId/units
 * @desc    Create a unit under a property
 * @access  Protected
 */
router.post(
  "/properties/:propertyId/units",
  authMiddleware,
  createUnitController,
);

/**
 * @route   GET /api/v1/properties/:propertyId/units
 * @desc    Get all units under a property
 * @access  Protected
 */
router.get(
  "/properties/:propertyId/units",
  authMiddleware,
  getUnitsByPropertyController,
);

/**
 * @route   DELETE /api/v1/units/:unitId
 * @desc    Delete unit (only if VACANT)
 * @access  Protected
 */
router.delete("/units/:unitId", authMiddleware, deleteUnitController);

export default router;
