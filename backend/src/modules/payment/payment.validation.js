import { body, param } from "express-validator";

export const recordPaymentRules = [
  param("rentBillId").isMongoId().withMessage("Invalid rent bill ID"),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be greater than 0"),

  body("method")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["CASH", "UPI", "BANK_TRANSFER"])
    .withMessage("Method must be one of: CASH, UPI, BANK_TRANSFER"),

  body("paidAt")
    .notEmpty()
    .withMessage("Payment date is required")
    .isISO8601()
    .withMessage("Payment date must be a valid ISO 8601 date"),

  body("reference")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Reference must be 200 characters or less"),
];

export const paymentParamRules = [
  param("paymentId").isMongoId().withMessage("Invalid payment ID"),
];

export const rentBillParamRules = [
  param("rentBillId").isMongoId().withMessage("Invalid rent bill ID"),
];
