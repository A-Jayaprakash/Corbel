import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "test-secret-key";

/**
 * Generate a valid JWT token for testing
 */
export const generateTestToken = (payload = {}) => {
  const defaultPayload = {
    owner_id: new Date().getTime().toString(),
    email: "test@example.com",
    ...payload,
  };

  return jwt.sign(defaultPayload, JWT_SECRET, {
    expiresIn: "1h",
  });
};

/**
 * Generate an expired JWT token
 */
export const generateExpiredToken = (payload = {}) => {
  const defaultPayload = {
    owner_id: new Date().getTime().toString(),
    email: "test@example.com",
    ...payload,
  };

  return jwt.sign(defaultPayload, JWT_SECRET, {
    expiresIn: "-1h",
  });
};

/**
 * Hash a password for testing
 */
export const hashTestPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

/**
 * Create authorization header
 */
export const createAuthHeader = (token) => ({
  Authorization: `Bearer ${token}`,
});

/**
 * Mock owner data
 */
export const mockOwnerData = {
  valid: {
    name: "John Doe",
    email: "john@example.com",
    password: "Password@123",
    mobileNumber: "+1234567890",
  },
  invalid: {
    email: "invalid-email",
    password: "weak",
  },
};
