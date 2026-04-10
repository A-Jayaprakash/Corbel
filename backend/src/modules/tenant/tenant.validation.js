import { body, param } from "express-validator";

export const assignTenantRules = [
  param("unitId").isMongoId().withMessage("Invalid unit ID"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tenant name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Tenant name must be 2–100 characters"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\+?[0-9]{7,15}$/)
    .withMessage("Phone must be 7–15 digits, optionally prefixed with +"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail(),
];

export const unitIdRules = [
  param("unitId").isMongoId().withMessage("Invalid unit ID"),
];
