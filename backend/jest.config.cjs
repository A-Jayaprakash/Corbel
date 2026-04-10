module.exports = {
  testEnvironment: "node",
  setupFiles: ["<rootDir>/tests/setup/jest.setup.cjs"],
  testMatch: ["<rootDir>/tests/**/*.test.js"],

  collectCoverageFrom: [
    "src/utils/**/*.js",
    "src/modules/**/*.service.js",
    "!src/modules/document/**",
  ],

  coverageThreshold: {
    global: {
      branches: 40,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};
