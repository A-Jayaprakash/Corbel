import request from "supertest";
import { connectDB, disconnectDB, clearDB } from "../utils/db.js";
import { generateTestToken } from "../utils/auth.js";

// Integration test example template
// Once app is properly configured, uncomment and implement

describe("Rent Bill API - Integration Tests", () => {
  // const app = require('../../../src/app.js');

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  afterEach(async () => {
    await clearDB();
  });

  let authToken;

  beforeEach(() => {
    authToken = generateTestToken();
  });

  describe("POST /api/v1/rent-bills", () => {
    it("should create a rent bill successfully", async () => {
      // const res = await request(app)
      //   .post('/api/v1/rent-bills')
      //   .set('Authorization', `Bearer ${authToken}`)
      //   .send({
      //     unitId: 'unit-123',
      //     tenantId: 'tenant-123',
      //     amount: 1500,
      //     dueDate: new Date('2024-03-05'),
      //     month: 'February',
      //     year: 2024,
      //   });

      // expect(res.statusCode).toBe(201);
      // expect(res.body).toHaveProperty('id');

      expect(true).toBe(true); // Placeholder
    });
  });

  describe("GET /api/v1/rent-bills", () => {
    it("should retrieve all rent bills for owner", async () => {
      // const res = await request(app)
      //   .get('/api/v1/rent-bills')
      //   .set('Authorization', `Bearer ${authToken}`);

      // expect(res.statusCode).toBe(200);
      // expect(Array.isArray(res.body)).toBe(true);

      expect(true).toBe(true); // Placeholder
    });
  });
});
