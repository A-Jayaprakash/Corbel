import express from "express";
import {
  registerOwnerController,
  loginOwnerController,
  refreshTokenController,
} from "./auth.controller.js";
import { registerRules, loginRules, refreshRules } from "./auth.validation.js";
import { validate } from "../../middleware/validate.middleware.js";

const router = express.Router();

router.post("/register", registerRules, validate, registerOwnerController);
router.post("/login", loginRules, validate, loginOwnerController);
router.post("/refresh", refreshRules, validate, refreshTokenController);

export default router;
