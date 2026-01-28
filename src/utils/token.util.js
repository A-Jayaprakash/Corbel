import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

if (!JWT_SECRET) {
  throw new Error("JWT is not defined in environment variables");
}

/**
 *
 * @param {Object} payload
 * @returns {string} jwt
 */

export const generateAccessToken = (payload) => {
  if (!payload) {
    throw new Error("Payload is not received");
  }
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 *
 * @param {string} token
 * @returns {Object} decoded payload
 */

export const verifyAccessToken = (token) => {
  if (!token) {
    throw new Error("JWT is required for verification");
  }
  return jwt.verify(token, JWT_SECRET);
};
