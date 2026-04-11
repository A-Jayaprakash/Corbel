import { body, param } from "express-validator";

const addressFields = (optional = false) => {
  const opt = (b) => (optional ? b.optional() : b);
  return [
    body("addressLine1")
      [optional ? "optional" : "notEmpty"]()
      .trim()
      .withMessage("Address line 1 is required"),
    body("addressLine2").optional().trim(),
    body("location")
      [optional ? "optional" : "notEmpty"]()
      .trim()
      .withMessage("Location is required"),
    body("pincode")
      [optional ? "optional" : "notEmpty"]()
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
};

export const createPropertyRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Property name is required")
    .isLength({ min: 2, max: 200 })
    .withMessage("Property name must be 2–200 characters"),
  ...addressFields(false),
];

export const updatePropertyRules = [
  param("propertyId").isMongoId().withMessage("Invalid property ID"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Name must be 2–200 characters"),
  ...addressFields(true),
];

export const propertyIdRules = [
  param("propertyId").isMongoId().withMessage("Invalid property ID"),
];
