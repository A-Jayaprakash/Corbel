import express from "express";
import {
  registerOwnerController,
  loginOwnerController,
} from "./auth.controller";

const router = express.Router();

/**
 * @route POST /api/v1/auth/register
 * @description Registering a new user
 * @access Public
 */
router.post("/register", registerOwnerController);

/**
 * @route POST /api/v1/auth/login
 * @description Login owner and issuing JWT token
 * @access Public
 */

router.get("/login", loginOwnerController);

export default router;
