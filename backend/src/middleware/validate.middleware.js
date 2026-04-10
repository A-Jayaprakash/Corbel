import { validationResult } from "express-validator";

/**
 * Runs after express-validator chains. If errors exist, returns 400.
 * Usage: router.post("/", [...rules], validate, controller)
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      statusCode: 400,
      message: "VALIDATION_ERROR",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};
