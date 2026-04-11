/**
 * Middleware to restrict access by role.
 * Usage: requireRole("owner", "admin")
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ statusCode: 403, message: "FORBIDDEN" });
    }
    next();
  };
};
