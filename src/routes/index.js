import express from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import propertyRoutes from "../modules/property/property.routes.js";
import unitRoutes from "../modules/unit/unit.routes.js";
import tenantRoutes from "../modules/tenant/tenant.routes.js";
import rentBillRoutes from "../modules/rent-bill/rent-bill.routes.js";

const router = express.Router();

/**
 * Base API routes
 */
router.use("/auth", authRoutes);
router.use("/properties", propertyRoutes);
router.use("/", unitRoutes);
router.use("/", tenantRoutes);
router.use("/", rentBillRoutes);
export default router;
