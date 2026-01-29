# Corbel Backend Testing - Complete Setup

## 📚 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Run Tests

```bash
# All tests with coverage
npm test

# Watch mode (re-run on file changes)
npm run test:watch

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration
```

### 3. View Coverage Report

```bash
npm test -- --coverage
open coverage/lcov-report/index.html  # macOS
start coverage/lcov-report/index.html # Windows
```

---

## 📁 Test File Organization

```
backend/
├── tests/
│   ├── unit/                      # Isolated unit tests
│   │   ├── auth/
│   │   │   ├── auth.controller.test.js
│   │   │   └── auth.service.test.js
│   │   ├── modules/              # Services for each domain
│   │   │   ├── property.service.test.js
│   │   │   ├── unit.service.test.js
│   │   │   ├── tenant.service.test.js
│   │   │   ├── rent-bill.service.test.js
│   │   │   ├── payment.service.test.js
│   │   │   └── billing.service.test.js
│   │   └── utils/               # Utility functions
│   │       ├── password.util.test.js
│   │       └── token.util.test.js
│   │
│   ├── integration/               # API & module integration
│   │   ├── auth.integration.test.js
│   │   ├── property.integration.test.js
│   │   ├── unit.integration.test.js
│   │   ├── tenant.integration.test.js
│   │   ├── rent-bill.integration.test.js
│   │   └── payment.integration.test.js
│   │
│   ├── e2e/                      # End-to-end workflows
│   │   ├── complete-workflow.test.js
│   │   └── billing-cycle.test.js
│   │
│   ├── fixtures/                 # Test data
│   │   └── data.js
│   │
│   ├── mocks/                    # Mock implementations
│   │   └── models.js
│   │
│   └── utils/                    # Test utilities
│       ├── db.js                # Database setup/teardown
│       ├── auth.js              # Auth helpers
│       └── test-helpers.js      # General helpers
│
├── jest.config.js               # Jest configuration
├── jest.setup.js                # Test setup
├── babel.config.js              # Babel configuration
├── .env.test                    # Test environment variables
└── package.json                 # Dependencies & scripts
```

---

## 🧪 Test Examples

### Unit Test - Service

```javascript
import * as authService from "../auth.service.js";
import { Owner } from "../../models/Owner.model.js";

jest.mock("../../models/Owner.model.js");

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register owner successfully", async () => {
    const ownerData = {
      name: "John Doe",
      email: "john@example.com",
      password: "SecurePass123",
      mobileNumber: "+1234567890",
    };

    Owner.findOne.mockResolvedValueOnce(null);
    Owner.create.mockResolvedValueOnce({
      _id: "507f1f77bcf86cd799439011",
      ...ownerData,
    });

    const result = await authService.registerOwner(ownerData);

    expect(result).toHaveProperty("id");
    expect(result.email).toBe(ownerData.email);
  });
});
```

### Unit Test - Controller

```javascript
import { registerOwnerController } from "../auth.controller.js";
import {
  createMockRequest,
  createMockResponse,
} from "../../utils/test-helpers.js";

describe("Auth Controller", () => {
  it("should return 201 on successful registration", async () => {
    const mockReq = createMockRequest({
      body: {
        name: "John Doe",
        email: "john@example.com",
        password: "SecurePass123",
        mobileNumber: "+1234567890",
      },
    });

    const mockRes = createMockResponse();
    const mockNext = jest.fn();

    await registerOwnerController(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalled();
  });
});
```

### Integration Test - API

```javascript
import request from "supertest";
import { connectDB, disconnectDB } from "../../utils/db.js";
import { generateTestToken } from "../../utils/auth.js";

describe("Property API", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it("should create property with valid token", async () => {
    const token = generateTestToken();

    const res = await request(app)
      .post("/api/v1/properties")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Downtown Building",
        address: "123 Main St",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });
});
```

---

## 🎯 Coverage Goals

| Metric     | Target | Current |
| ---------- | ------ | ------- |
| Lines      | 75%    | -       |
| Statements | 75%    | -       |
| Functions  | 75%    | -       |
| Branches   | 70%    | -       |

After running `npm test -- --coverage`, view detailed metrics in `coverage/index.html`.

---

## 🔍 Common Commands

### Run Single Test File

```bash
npm test -- auth.controller.test.js
```

### Run Tests Matching Pattern

```bash
npm test -- --testNamePattern="should register"
```

### Update Snapshots

```bash
npm test -- -u
```

### Debug Test

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
# Then open chrome://inspect in Chrome DevTools
```

---

## ✅ Testing Checklist for New Features

When implementing a new feature:

- [ ] Write unit tests for service/controller
- [ ] Write integration tests for API endpoints
- [ ] Ensure 75%+ code coverage
- [ ] Test error scenarios
- [ ] Test validation & edge cases
- [ ] Mock external dependencies
- [ ] Add test fixtures if needed
- [ ] Update this README if structure changes

---

## 📊 Viewing Coverage Reports

After running tests with `--coverage`:

```bash
# macOS
open coverage/lcov-report/index.html

# Windows
start coverage/lcov-report/index.html

# Linux
xdg-open coverage/lcov-report/index.html
```

The report shows:

- Line coverage: Which lines were executed
- Branch coverage: Which if/else paths were taken
- Function coverage: Which functions were called
- Statement coverage: Which statements were executed

---

## 🚀 CI/CD Integration

Tests automatically run on:

- ✅ Push to `main` or `dev` branches
- ✅ Pull requests
- ✅ Manual trigger via GitHub Actions

See `.github/workflows/` for configuration.

---

## 🐛 Troubleshooting

### Tests Timeout

```javascript
jest.setTimeout(30000); // Increase timeout in test
```

### Cannot find module

```bash
npm install
npm run test -- --clearCache
```

### Mock not working

```javascript
jest.clearAllMocks(); // Add before test
jest.resetModules(); // Reset module cache
```

### Database connection fails

Ensure MongoDB Memory Server is started:

```javascript
beforeAll(async () => {
  await connectDB();
});
```

---

## 📚 Resources

- [Jest Official Docs](https://jestjs.io/)
- [SuperTest Guide](https://github.com/visionmedia/supertest)
- [Testing Best Practices](./testing-guide.md)
- [Node.js Testing Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## 👥 Contributing Tests

1. **Write tests first** (TDD approach)
2. **Follow naming conventions** (`*.test.js`)
3. **Use fixtures** from `tests/fixtures/data.js`
4. **Mock external** dependencies
5. **Ensure coverage** above thresholds
6. **Update docs** if structure changes

---

## 📝 Notes

- Tests run with Node.js environment
- MongoDB Memory Server provides isolated test DB
- All mocks auto-reset between tests
- Tests can run in parallel for speed
- E2E tests run separately on schedule

---

**Last Updated:** January 29, 2026  
**Version:** 1.0.0
