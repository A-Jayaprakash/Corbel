import jwt from "jsonwebtoken";

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return secret;
};

/**
 * Generate a signed JWT access token
 * @param {Object} payload - Data to embed (e.g. { owner_id, email })
 * @returns {string} Signed JWT
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, getSecret(), { expiresIn: "1h" });
};

/**
 * Verify and decode a JWT access token
 * @param {string} token
 * @returns {Object} Decoded payload
 * @throws if token is invalid or expired
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, getSecret());
};
