import express from "express";
import {
  createUnitController,
  getUnitsByPropertyController,
  deleteUnitController,
} from "./unit.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { createUnitRules, unitIdRules } from "./unit.validation.js";
import { validate } from "../../middleware/validate.middleware.js";

const router = express.Router();

/**
 * @route POST /api/v1/properties/:propertyId/units
 * @access Protected
 */
router.post(
  "/properties/:propertyId/units",
  authMiddleware,
  createUnitRules,
  validate,
  createUnitController,
);

/**
 * @route GET /api/v1/properties/:propertyId/units
 * @access Protected
 */
router.get(
  "/properties/:propertyId/units",
  authMiddleware,
  getUnitsByPropertyController,
);

/**
 * @route DELETE /api/v1/units/:unitId
 * @access Protected
 */
router.delete(
  "/units/:unitId",
  authMiddleware,
  unitIdRules,
  validate,
  deleteUnitController,
);

export default router;
