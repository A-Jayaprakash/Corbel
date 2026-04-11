import express from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { Tenant } from "../../models/Tenant.model.js";
import { Unit } from "../../models/Unit.model.js";
import { Property } from "../../models/Property.model.js";
import { Owner } from "../../models/Owner.model.js";

const router = express.Router();

// GET /api/v1/tenant/me — tenant sees own unit, property, and owner contact
router.get(
  "/me",
  authMiddleware,
  requireRole("tenant"),
  async (req, res, next) => {
    try {
      const [tenant, unit, property, owner] = await Promise.all([
        Tenant.findById(req.user.id),
        Unit.findById(req.user.unitId),
        Property.findById(req.user.propertyId),
        Owner.findById(req.user.ownerId).select("name email mobileNumber"),
      ]);

      if (!tenant) {
        return res
          .status(404)
          .json({ statusCode: 404, message: "TENANT_NOT_FOUND" });
      }

      return res.status(200).json({
        tenant: {
          id: tenant._id,
          name: tenant.name,
          email: tenant.email,
          phone: tenant.phone,
          status: tenant.status,
          tenancyStartDate: tenant.tenancyStartDate,
        },
        unit: unit
          ? {
              id: unit._id,
              unitName: unit.unitName,
              monthlyRent: unit.monthlyRent,
              advanceAmount: unit.advanceAmount,
            }
          : null,
        property: property
          ? {
              id: property._id,
              name: property.name,
              addressLine1: property.addressLine1,
              addressLine2: property.addressLine2,
              location: property.location,
              pincode: property.pincode,
            }
          : null,
        owner: owner
          ? { name: owner.name, email: owner.email, phone: owner.mobileNumber }
          : null,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
