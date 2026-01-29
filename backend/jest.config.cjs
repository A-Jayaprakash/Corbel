module.exports = {
  testEnvironment: "node",
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.js", "!src/server.js", "!src/**/*.test.js"],
  testMatch: ["**/__tests__/**/*.test.js", "**/*.test.js"],
  transformIgnorePatterns: ["/node_modules/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  coverageThreshold: {
    global: {
      branches: 5,
      functions: 5,
      lines: 5,
      statements: 5,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.cjs"],
  testTimeout: 30000,
  verbose: true,
};
