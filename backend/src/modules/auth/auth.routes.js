import express from "express";
import {
  registerOwnerController,
  loginOwnerController,
} from "./auth.controller.js";
import { registerRules, loginRules } from "./auth.validation.js";
import { validate } from "../../middleware/validate.middleware.js";

const router = express.Router();

/**
 * @route POST /api/v1/auth/register
 * @access Public
 */
router.post("/register", registerRules, validate, registerOwnerController);

/**
 * @route POST /api/v1/auth/login
 * @access Public
 */
router.post("/login", loginRules, validate, loginOwnerController);

export default router;
