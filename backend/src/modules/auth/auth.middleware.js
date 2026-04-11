import { verifyAccessToken } from "../../utils/token.util.js";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ statusCode: 401, message: "UNAUTHORIZED" });
    }

    const decoded = verifyAccessToken(authHeader.split(" ")[1]);

    req.user = {
      id: decoded.user_id,
      email: decoded.email,
      role: decoded.role || "owner",
      unitId: decoded.unitId,
      propertyId: decoded.propertyId,
      ownerId: decoded.ownerId,
    };

    // Backwards compat: req.owner.id = the ownerId used to scope queries
    // admin → null (services skip the filter), tenant → their ownerId, owner → their id
    req.owner = {
      id:
        req.user.role === "admin"
          ? null
          : req.user.role === "tenant"
            ? req.user.ownerId
            : req.user.id,
      email: req.user.email,
    };

    next();
  } catch {
    return res.status(401).json({ statusCode: 401, message: "UNAUTHORIZED" });
  }
};

export const authenticateOwner = authMiddleware;
