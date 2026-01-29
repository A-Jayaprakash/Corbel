import { verifyAccessToken } from "../../utils/token.util";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    req.owner = {
      id: decoded.owner._id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      error: "UNAUTHORIZED",
    });
  }
};
