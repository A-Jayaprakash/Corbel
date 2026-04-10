import express from "express";
import {
  assignTenantToUnitController,
  getActiveTenantForUnitController,
  updateTenantController,
  removeTenantFromUnitController,
} from "./tenant.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import {
  assignTenantRules,
  updateTenantRules,
  unitIdRules,
} from "./tenant.validation.js";
import { validate } from "../../middleware/validate.middleware.js";

const router = express.Router();

/**
 * @route POST /api/v1/units/:unitId/tenant
 * @access Protected
 */
router.post(
  "/units/:unitId/tenant",
  authMiddleware,
  assignTenantRules,
  validate,
  assignTenantToUnitController,
);

/**
 * @route GET /api/v1/units/:unitId/tenant
 * @access Protected
 */
router.get(
  "/units/:unitId/tenant",
  authMiddleware,
  unitIdRules,
  validate,
  getActiveTenantForUnitController,
);

/**
 * @route DELETE /api/v1/units/:unitId/tenant
 * @access Protected
 */
router.patch(
  "/units/:unitId/tenant",
  authMiddleware,
  updateTenantRules,
  validate,
  updateTenantController,
);

router.delete(
  "/units/:unitId/tenant",
  authMiddleware,
  unitIdRules,
  validate,
  removeTenantFromUnitController,
);

export default router;
