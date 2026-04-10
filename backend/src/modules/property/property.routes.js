import express from "express";
import {
  createPropertyController,
  getPropertiesController,
  deletePropertyController,
} from "./property.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { createPropertyRules, propertyIdRules } from "./property.validation.js";
import { validate } from "../../middleware/validate.middleware.js";

const router = express.Router();

/**
 * @route POST /api/v1/properties
 * @access Protected
 */
router.post(
  "/",
  authMiddleware,
  createPropertyRules,
  validate,
  createPropertyController,
);

/**
 * @route GET /api/v1/properties
 * @access Protected
 */
router.get("/", authMiddleware, getPropertiesController);

/**
 * @route DELETE /api/v1/properties/:propertyId
 * @access Protected
 */
router.delete(
  "/:propertyId",
  authMiddleware,
  propertyIdRules,
  validate,
  deletePropertyController,
);

export default router;
