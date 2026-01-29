const dotenv = require("dotenv");

// Load test environment variables
dotenv.config({ path: ".env.test" });

// Set environment to test
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-key";
process.env.MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/corbel-test";

// Increase timeout for database operations
jest.setTimeout(30000);

// Global test utilities
global.testUtils = {
  generateMockId: () => Math.random().toString(36).substr(2, 9),
  wait: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
};

// Suppress console output during tests (optional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
// };
//   info: jest.fn(),
//   warn: jest.fn(),
// };
