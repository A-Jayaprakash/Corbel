import express from "express";
import {
  registerOwnerController,
  loginOwnerController,
} from "./auth.controller.js";

const router = express.Router();

/**
 * @route POST /api/v1/auth/register
 * @description Register a new owner
 * @access Public
 */
router.post("/register", registerOwnerController);

/**
 * @route POST /api/v1/auth/login
 * @description Login owner and issue JWT token
 * @access Public
 */
router.post("/login", loginOwnerController);

export default router;
