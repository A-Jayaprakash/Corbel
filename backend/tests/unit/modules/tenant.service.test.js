import {
  jest,
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
} from "@jest/globals";

jest.unstable_mockModule("../../../src/models/Tenant.model.js", () => ({
  Tenant: { findOne: jest.fn(), create: jest.fn() },
}));
jest.unstable_mockModule("../../../src/models/Unit.model.js", () => ({
  Unit: { findOne: jest.fn() },
}));
jest.unstable_mockModule("../../../src/models/Property.model.js", () => ({
  Property: { findOne: jest.fn() },
}));

let assignTenantToUnit,
  getActiveTenantForUnit,
  updateTenant,
  removeTenantFromUnit;
let Tenant, Unit, Property;

beforeAll(async () => {
  ({
    assignTenantToUnit,
    getActiveTenantForUnit,
    updateTenant,
    removeTenantFromUnit,
  } = await import("../../../src/modules/tenant/tenant.service.js"));
  ({ Tenant } = await import("../../../src/models/Tenant.model.js"));
  ({ Unit } = await import("../../../src/models/Unit.model.js"));
  ({ Property } = await import("../../../src/models/Property.model.js"));
});

beforeEach(() => jest.clearAllMocks());

describe("Tenant Service", () => {
  describe("assignTenantToUnit", () => {
    it("should create tenant and mark unit OCCUPIED", async () => {
      const mockUnit = {
        _id: "u1",
        status: "VACANT",
        propertyId: "p1",
        save: jest.fn(),
      };
      Unit.findOne.mockResolvedValueOnce(mockUnit);
      Property.findOne.mockResolvedValueOnce({ _id: "p1" });
      Tenant.create.mockResolvedValueOnce({ _id: "t1", status: "ACTIVE" });

      const result = await assignTenantToUnit({
        ownerId: "o1",
        unitId: "u1",
        name: "Alice",
        phone: "999",
        email: "a@a.com",
      });

      expect(mockUnit.status).toBe("OCCUPIED");
      expect(mockUnit.save).toHaveBeenCalled();
      expect(result._id).toBe("t1");
    });

    it("should throw 404 when unit not found", async () => {
      Unit.findOne.mockResolvedValueOnce(null);

      await expect(
        assignTenantToUnit({
          ownerId: "o1",
          unitId: "u1",
          name: "A",
          phone: "1",
          email: "a@a.com",
        }),
      ).rejects.toEqual({ statusCode: 404, message: "UNIT_NOT_FOUND" });
    });

    it("should throw 400 when unit is not vacant", async () => {
      Unit.findOne.mockResolvedValueOnce({ _id: "u1", status: "OCCUPIED" });

      await expect(
        assignTenantToUnit({
          ownerId: "o1",
          unitId: "u1",
          name: "A",
          phone: "1",
          email: "a@a.com",
        }),
      ).rejects.toEqual({ statusCode: 400, message: "UNIT_NOT_VACANT" });
    });
  });

  describe("getActiveTenantForUnit", () => {
    it("should return active tenant", async () => {
      Unit.findOne.mockResolvedValueOnce({ _id: "u1" });
      Tenant.findOne.mockResolvedValueOnce({ _id: "t1", status: "ACTIVE" });

      const result = await getActiveTenantForUnit({
        ownerId: "o1",
        unitId: "u1",
      });

      expect(Tenant.findOne).toHaveBeenCalledWith({
        unitId: "u1",
        ownerId: "o1",
        status: "ACTIVE",
      });
      expect(result._id).toBe("t1");
    });

    it("should throw 404 when unit not found", async () => {
      Unit.findOne.mockResolvedValueOnce(null);

      await expect(
        getActiveTenantForUnit({ ownerId: "o1", unitId: "u1" }),
      ).rejects.toEqual({
        statusCode: 404,
        message: "UNIT_NOT_FOUND",
      });
    });
  });

  describe("updateTenant", () => {
    it("should update tenant fields and save", async () => {
      const mockTenant = {
        _id: "t1",
        name: "Alice",
        phone: "999",
        email: "a@a.com",
        save: jest.fn(),
      };
      Unit.findOne.mockResolvedValueOnce({ _id: "u1" });
      Tenant.findOne.mockResolvedValueOnce(mockTenant);

      const result = await updateTenant({
        ownerId: "o1",
        unitId: "u1",
        name: "Bob",
      });

      expect(mockTenant.name).toBe("Bob");
      expect(mockTenant.save).toHaveBeenCalled();
      expect(result).toBe(mockTenant);
    });

    it("should throw 404 when no active tenant", async () => {
      Unit.findOne.mockResolvedValueOnce({ _id: "u1" });
      Tenant.findOne.mockResolvedValueOnce(null);

      await expect(
        updateTenant({ ownerId: "o1", unitId: "u1", name: "B" }),
      ).rejects.toEqual({
        statusCode: 404,
        message: "ACTIVE_TENANT_NOT_FOUND",
      });
    });
  });
});
