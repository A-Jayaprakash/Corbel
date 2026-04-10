const dotenv = require("dotenv");

// Load test-specific env file (optional)
dotenv.config({ path: ".env.test" });

// Force test environment
process.env.NODE_ENV = "test";

// Required runtime env vars
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
process.env.MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/corbel-test";

// Jest timeout
jest.setTimeout(30000);

// Global helpers (optional)
global.testUtils = {
  generateMockId: () => Math.random().toString(36).substring(2, 9),
  wait: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
};
