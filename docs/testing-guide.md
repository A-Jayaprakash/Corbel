# 🧪 Corbel Backend - Comprehensive Testing Strategy

> Production-grade testing framework for V1.0.0 with Jest, SuperTest, and MongoDB Memory Server

## 📋 Overview

This document outlines the complete testing strategy for the Corbel property management backend, following industry best practices for REST API testing.

## 🏗️ Testing Architecture

### Test Pyramid

```
       E2E Tests (5-10%)
        /            \
      Integration     \
      Tests (15-20%)   \
      /                  \
    Unit Tests (70-80%)   \
    ___________________
```

### Test Layers

#### 1. **Unit Tests** (70-80%)

- Test individual functions/methods in isolation
- Mock external dependencies (database, APIs, utilities)
- Fast execution (< 1 second per test)
- Location: `tests/unit/`

#### 2. **Integration Tests** (15-20%)

- Test interactions between modules
- Use MongoDB Memory Server for real database testing
- Test API endpoints with SuperTest
- Location: `tests/integration/`

#### 3. **E2E Tests** (5-10%)

- Test complete workflows (user registration → login → create property)
- Location: `tests/e2e/` (future implementation)

---

## 📦 Dependencies

### Testing Libraries

| Package                   | Version | Purpose                                |
| ------------------------- | ------- | -------------------------------------- |
| **jest**                  | ^29.7.0 | Test runner & assertion library        |
| **supertest**             | ^6.3.3  | HTTP assertion library for API testing |
| **jest-mock-extended**    | ^3.0.5  | Enhanced mocking capabilities          |
| **mongodb-memory-server** | ^9.1.6  | In-memory MongoDB for testing          |
| **@types/jest**           | ^29.5.8 | TypeScript types for Jest              |
| **babel-jest**            | ^29.7.0 | Babel transformer for Jest             |

### Development Tools

- **nodemon**: Auto-restart on file changes (development)
- **eslint**: Code quality and style
- **prettier**: Code formatting

---

## 🎯 Running Tests

### Install Dependencies

```bash
npm install
```

### Run All Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Specific Test Suites

```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# E2E tests only (future)
npm run test:e2e

# All tests with coverage
npm run test:all
```

### Run Specific Test File

```bash
npm test -- auth.controller.test.js
npm test -- --testPathPattern="auth"
```

---

## 📁 Project Structure

```
tests/
├── unit/
│   ├── auth/
│   │   ├── auth.controller.test.js       # Controller logic
│   │   └── auth.service.test.js          # Business logic
│   ├── modules/
│   │   ├── property.service.test.js
│   │   ├── unit.service.test.js
│   │   ├── tenant.service.test.js
│   │   ├── rent-bill.service.test.js
│   │   ├── payment.service.test.js
│   │   └── billing.service.test.js
│   └── utils/
│       ├── password.util.test.js
│       └── token.util.test.js
├── integration/
│   ├── auth.integration.test.js          # Auth API endpoints
│   ├── property.integration.test.js      # Property API endpoints
│   ├── unit.integration.test.js
│   ├── tenant.integration.test.js
│   ├── rent-bill.integration.test.js
│   └── payment.integration.test.js
├── e2e/
│   ├── complete-workflow.test.js        # Full user journeys
│   └── billing-cycle.test.js
├── mocks/
│   ├── models.js                        # Mongoose model mocks
│   └── services.js                      # Service mocks
├── fixtures/
│   └── data.js                          # Mock data & test fixtures
└── utils/
    ├── db.js                            # Database setup/teardown
    ├── auth.js                          # Auth testing utilities
    └── test-helpers.js                  # General test helpers
```

---

## 🔧 Configuration Files

### `jest.config.js`

Main Jest configuration with:

- Test environment: Node.js
- Coverage thresholds: 70% minimum
- Module name mapping for imports
- Test timeout: 30 seconds
- Auto-setup: `jest.setup.js`

### `jest.setup.js`

Global test setup:

- Environment variables loading
- Jest timeout configuration
- Global test utilities
- Mock implementations

### `babel.config.js`

Babel configuration for ES module support

### `.env.test`

Test environment variables (never commit credentials)

---

## 💡 Testing Best Practices

### 1. **Unit Test Pattern**

```javascript
describe("Service Name", () => {
  describe("methodName", () => {
    it("should do something specific", () => {
      // Arrange
      const input = {
        /* test data */
      };

      // Act
      const result = method(input);

      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

### 2. **Mocking Strategy**

- Mock **external** dependencies (database, APIs)
- Mock **internal** dependencies for unit tests
- Use **real** dependencies for integration tests
- Clear mocks before each test: `jest.clearAllMocks()`

### 3. **Naming Conventions**

- Test files: `*.test.js`
- Describe blocks: Noun (e.g., "Auth Controller", "User Service")
- Test cases: Action sentence (e.g., "should return 200 status code")

### 4. **Coverage Goals**

```
global: {
  branches: 70%      # All if/else branches
  functions: 75%     # All functions called
  lines: 75%         # All lines executed
  statements: 75%    # All statements executed
}
```

### 5. **Async Testing**

```javascript
// Using async/await
it("should do async operation", async () => {
  const result = await asyncFunction();
  expect(result).toBe(expected);
});

// Using promises
it("should do async operation", () => {
  return asyncFunction().then((result) => {
    expect(result).toBe(expected);
  });
});

// Using done callback
it("should do async operation", (done) => {
  asyncFunction().then(() => {
    expect(true).toBe(true);
    done();
  });
});
```

---

## 🎯 Testing Each Module

### Auth Module

**Files to test:**

- `auth.service.js` - registerOwner, loginOwner
- `auth.controller.js` - API endpoints
- `password.util.js` - Password hashing/comparison
- `token.util.js` - JWT token generation

**Test scenarios:**

- ✅ Successful registration/login
- ✅ Duplicate email handling
- ✅ Invalid credentials
- ✅ Password hashing consistency
- ✅ Token generation & expiration

### Property Module

**Files to test:**

- `property.service.js` - CRUD operations
- `property.controller.js` - API handlers
- Authorization checks

**Test scenarios:**

- ✅ Create property
- ✅ Get properties (by owner)
- ✅ Update property
- ✅ Delete property
- ✅ Prevent unauthorized access

### Other Modules

Similar structure for:

- Unit Module
- Tenant Module
- Rent Bill Module
- Payment Module
- Billing Module

---

## 📊 Database Testing Strategy

### MongoDB Memory Server

```javascript
// Setup
beforeAll(async () => {
  await connectDB(); // Start in-memory MongoDB
});

// Teardown
afterAll(async () => {
  await disconnectDB();
});

// Cleanup between tests
afterEach(async () => {
  await clearDB();
});
```

### Benefits

- ✅ No external database needed
- ✅ Isolated test data (auto-cleared)
- ✅ Fast test execution
- ✅ Parallel test execution safe
- ✅ Perfect for CI/CD pipelines

---

## 🔐 Mocking Authentication

### Generate Test Tokens

```javascript
import { generateTestToken } from "../../utils/auth.js";

const token = generateTestToken({
  owner_id: "test-id",
  email: "test@example.com",
});

// Use in requests
request(app).get("/api/v1/properties").set("Authorization", `Bearer ${token}`);
```

### Mock Request/Response

```javascript
import {
  createMockRequest,
  createMockResponse,
  createMockNext,
} from "../../utils/test-helpers.js";

const req = createMockRequest({
  /* overrides */
});
const res = createMockResponse();
const next = createMockNext();

await controller(req, res, next);
expect(res.status).toHaveBeenCalledWith(200);
```

---

## ✅ Test Checklist

Before marking tests as complete:

- [ ] All happy path scenarios covered
- [ ] All error scenarios covered
- [ ] Edge cases tested
- [ ] Validation tested
- [ ] Mocks properly isolated
- [ ] Coverage > 70%
- [ ] Tests run in < 30 seconds
- [ ] No console warnings
- [ ] Fixtures properly cleaned up
- [ ] Mock functions reset between tests

---

## 🚀 CI/CD Integration

### GitHub Actions Setup

See `.github/workflows/test.yml` for:

- Automated test runs on push/PR
- Coverage reporting
- Test failure notifications
- Coverage threshold enforcement

```yaml
- name: Run tests
  run: npm test -- --coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

---

## 📈 Measuring Test Quality

### Coverage Reports

```bash
npm test -- --coverage
```

Generates:

- Line coverage: % of code lines executed
- Branch coverage: % of if/else branches tested
- Function coverage: % of functions called
- Statement coverage: % of statements executed

View detailed report:

```bash
open coverage/lcov-report/index.html
```

---

## 🐛 Debugging Tests

### Run Single Test

```bash
npm test -- --testNamePattern="should register owner"
```

### Run with Detailed Output

```bash
npm test -- --verbose
```

### Debug in VS Code

1. Add breakpoint
2. Run: `node --inspect-brk node_modules/.bin/jest --runInBand`
3. Open Chrome DevTools

### View Mock Calls

```javascript
// See all calls to a mock
console.log(mockFunction.mock.calls);

// See arguments of first call
console.log(mockFunction.mock.calls[0]);

// See return value of first call
console.log(mockFunction.mock.results[0].value);
```

---

## 📝 Writing Your First Test

### Step 1: Identify what to test

```javascript
// authService.registerOwner()
```

### Step 2: Setup test file

```javascript
import { registerOwner } from "../auth.service";
jest.mock("../../models/Owner.model");
```

### Step 3: Write test

```javascript
it("should register owner successfully", async () => {
  const result = await registerOwner({
    name: "John",
    email: "john@example.com",
    password: "pass123",
    mobileNumber: "+123",
  });

  expect(result).toHaveProperty("id");
  expect(result.email).toBe("john@example.com");
});
```

### Step 4: Run test

```bash
npm test -- auth.service.test.js
```

---

## 🔄 Test-Driven Development (TDD)

### 1. **Red Phase** - Write failing test

```javascript
it("should accept valid email on registration", () => {
  // Test will fail - feature not implemented
});
```

### 2. **Green Phase** - Implement minimum code

```javascript
// Implement just enough to pass
if (!email.includes("@")) throw Error();
```

### 3. **Refactor Phase** - Improve code quality

```javascript
// Add proper validation, error handling
```

---

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [SuperTest Documentation](https://github.com/visionmedia/supertest)
- [Testing Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices#6-testing-best-practices)
- [MongoDB Memory Server](https://github.com/typegoose/mongodb-memory-server)

---

## 🎓 Quick Reference

### Common Jest Matchers

```javascript
expect(value).toBe(expected); // ===
expect(value).toEqual(expected); // Deep equality
expect(array).toContain(item); // Array contains
expect(object).toHaveProperty("key"); // Object property exists
expect(fn).toHaveBeenCalled(); // Mock was called
expect(fn).toHaveBeenCalledWith(args); // Mock called with args
expect(promise).rejects.toThrow(); // Promise rejects
expect(promise).resolves.toBe(value); // Promise resolves to value
```

### Common Test Setup

```javascript
beforeAll(async () => {}); // Before all tests in suite
beforeEach(() => {}); // Before each test
afterEach(() => {}); // After each test
afterAll(async () => {}); // After all tests in suite
```

---

**Last Updated:** January 29, 2026  
**Version:** 1.0.0  
**Author:** Testing Team - Corbel Project
