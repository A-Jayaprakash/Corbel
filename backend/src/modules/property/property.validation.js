import { body, param } from "express-validator";

export const createPropertyRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Property name is required")
    .isLength({ min: 2, max: 200 })
    .withMessage("Property name must be 2–200 characters"),

  body("address")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Address must be 500 characters or less"),
];

export const updatePropertyRules = [
  param("propertyId").isMongoId().withMessage("Invalid property ID"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Name must be 2–200 characters"),
  body("address")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Address must be 500 characters or less"),
];

export const propertyIdRules = [
  param("propertyId").isMongoId().withMessage("Invalid property ID"),
];
