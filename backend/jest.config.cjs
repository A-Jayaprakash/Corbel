export default {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup/jest.setup.js"],

  collectCoverageFrom: [
    "src/utils/**/*.js",
    "src/modules/**/**.service.js",
    "!src/modules/**/**.controller.js",
    "!src/modules/**/**.routes.js",
    "!src/models/**/*.js",
    "!src/middleware/**/*.js",
  ],

  coverageThreshold: {
    global: {
      branches: 5,
      functions: 5,
      lines: 5,
      statements: 5,
    },
  },
};
