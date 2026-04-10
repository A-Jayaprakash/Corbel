import { body, param } from "express-validator";

export const createRentBillRules = [
  param("unitId").isMongoId().withMessage("Invalid unit ID"),

  body("billingMonth")
    .notEmpty()
    .withMessage("Billing month is required")
    .matches(/^\d{4}-(0[1-9]|1[0-2])$/)
    .withMessage("Billing month must be in YYYY-MM format"),

  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Due date must be a valid ISO 8601 date"),
];

export const rentBillParamRules = [
  param("rentBillId").isMongoId().withMessage("Invalid rent bill ID"),
];

export const monthParamRules = [
  param("unitId").isMongoId().withMessage("Invalid unit ID"),

  param("month")
    .matches(/^\d{4}-(0[1-9]|1[0-2])$/)
    .withMessage("Month must be in YYYY-MM format"),
];
