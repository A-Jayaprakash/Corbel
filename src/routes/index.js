import express from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import propertyRoutes from "../modules/property/property.routes.js";
import unitRoutes from "../modules/unit/unit.routes.js";

const router = express.Router();

/**
 * Base API routes
 */
router.use("/auth", authRoutes);
router.use("/properties", propertyRoutes);
router.use("/", unitRoutes);

export default router;
