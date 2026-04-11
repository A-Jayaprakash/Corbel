import { body, param } from "express-validator";

export const createPropertyRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Property name is required")
    .isLength({ min: 2, max: 200 })
    .withMessage("Property name must be 2–200 characters"),
  body("addressLine1")
    .trim()
    .notEmpty()
    .withMessage("Address line 1 is required"),
  body("addressLine2").optional().trim(),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("pincode")
    .trim()
    .notEmpty()
    .withMessage("Pincode is required")
    .matches(/^\d{4,10}$/)
    .withMessage("Pincode must be 4–10 digits"),
  body("ownerName").optional().trim(),
  body("phone")
    .optional()
    .trim()
    .matches(/^\+?[0-9]{7,15}$/)
    .withMessage("Invalid phone number"),
];

export const updatePropertyRules = [
  param("propertyId").isMongoId().withMessage("Invalid property ID"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Name must be 2–200 characters"),
  body("addressLine1").optional().trim(),
  body("addressLine2").optional().trim(),
  body("location").optional().trim(),
  body("pincode")
    .optional()
    .trim()
    .matches(/^\d{4,10}$/)
    .withMessage("Pincode must be 4–10 digits"),
  body("ownerName").optional().trim(),
  body("phone")
    .optional()
    .trim()
    .matches(/^\+?[0-9]{7,15}$/)
    .withMessage("Invalid phone number"),
];

export const propertyIdRules = [
  param("propertyId").isMongoId().withMessage("Invalid property ID"),
];
