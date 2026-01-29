import express from "express";
import {
  createPropertyController,
  getPropertiesController,
  deletePropertyController,
} from "./property.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/v1/properties
 * @desc    Create a new property
 * @access  Protected
 */
router.post("/", authMiddleware, createPropertyController);

/**
 * @route   GET /api/v1/properties
 * @desc    Get all properties for logged-in owner
 * @access  Protected
 */
router.get("/", authMiddleware, getPropertiesController);

/**
 * @route   DELETE /api/v1/properties/:propertyId
 * @desc    Delete property (only if no units exist)
 * @access  Protected
 */
router.delete("/:propertyId", authMiddleware, deletePropertyController);

export default router;
