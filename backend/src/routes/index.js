import express from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import propertyRoutes from "../modules/property/property.routes.js";
import unitRoutes from "../modules/unit/unit.routes.js";
import tenantRoutes from "../modules/tenant/tenant.routes.js";
import rentBillRoutes from "../modules/rent-bill/rent-bill.routes.js";
import monthlyBillingRoutes from "../modules/billing/monthly-billing.routes.js";
import paymentRoutes from "../modules/payment/payment.routes.js";
import documentRoutes from "../modules/document/document.routes.js";

const router = express.Router();

/**
 * Base API routes
 */
router.use("/auth", authRoutes);
router.use("/properties", propertyRoutes);
router.use("/", unitRoutes);
router.use("/", tenantRoutes);
router.use("/", rentBillRoutes);
router.use("/billing", monthlyBillingRoutes);
router.use("/", paymentRoutes);
router.use("/documents", documentRoutes);
export default router;
