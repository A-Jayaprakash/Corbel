import { verifyAccessToken } from "../../utils/token.util.js";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        statusCode: 401,
        message: "UNAUTHORIZED",
        description: "Missing or invalid authorization header",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    req.owner = {
      id: decoded.owner_id || decoded.owner?._id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      statusCode: 401,
      message: "UNAUTHORIZED",
      description: "Invalid or expired token",
    });
  }
};

export const authenticateOwner = authMiddleware;
export const authenticateOwner = authMiddleware;
