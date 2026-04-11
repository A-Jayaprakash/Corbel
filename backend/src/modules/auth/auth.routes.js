import express from "express";
import {
  registerOwnerController,
  loginOwnerController,
  refreshTokenController,
  setTenantPasswordController,
} from "./auth.controller.js";
import { registerRules, loginRules, refreshRules } from "./auth.validation.js";
import { validate } from "../../middleware/validate.middleware.js";
import { authMiddleware } from "./auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { body } from "express-validator";

const router = express.Router();

router.post("/register", registerRules, validate, registerOwnerController);
router.post("/login", loginRules, validate, loginOwnerController);
router.post("/refresh", refreshRules, validate, refreshTokenController);

// Owner sets/resets a tenant's login password
router.post(
  "/tenants/:tenantId/set-password",
  authMiddleware,
  requireRole("owner", "admin"),
  [
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validate,
  setTenantPasswordController,
);

export default router;
