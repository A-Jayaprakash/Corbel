/**
 * Central error handler.
 * Services throw plain objects { statusCode, message } for domain errors.
 * Everything else is treated as an unexpected 500.
 */
export const errorMiddleware = (err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    statusCode,
    message,
  });
};
