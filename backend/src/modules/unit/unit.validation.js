import { body, param } from "express-validator";

export const createUnitRules = [
  param("propertyId")
    .isMongoId()
    .withMessage("Invalid property ID"),

  body("unitName")
    .trim()
    .notEmpty()
    .withMessage("Unit name is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Unit name must be 1–100 characters"),

  body("monthlyRent")
    .notEmpty()
    .withMessage("Monthly rent is required")
    .isFloat({ min: 0 })
    .withMessage("Monthly rent must be a non-negative number"),

  body("advanceAmount")
    .notEmpty()
    .withMessage("Advance amount is required")
    .isFloat({ min: 0 })
    .withMessage("Advance amount must be a non-negative number"),
];

export const unitIdRules = [
  param("unitId")
    .isMongoId()
    .withMessage("Invalid unit ID"),
];
