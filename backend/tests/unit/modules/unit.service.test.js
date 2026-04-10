import {
  jest,
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
} from "@jest/globals";

jest.unstable_mockModule("../../../src/models/Unit.model.js", () => ({
  Unit: { find: jest.fn(), findOne: jest.fn(), create: jest.fn() },
}));
jest.unstable_mockModule("../../../src/models/Property.model.js", () => ({
  Property: { findOne: jest.fn() },
}));

let createUnit, getUnitsByProperty, updateUnit, deleteUnit, Unit, Property;

beforeAll(async () => {
  ({ createUnit, getUnitsByProperty, updateUnit, deleteUnit } =
    await import("../../../src/modules/unit/unit.service.js"));
  ({ Unit } = await import("../../../src/models/Unit.model.js"));
  ({ Property } = await import("../../../src/models/Property.model.js"));
});

beforeEach(() => jest.clearAllMocks());

describe("Unit Service", () => {
  describe("createUnit", () => {
    it("should create a VACANT unit when property exists", async () => {
      Property.findOne.mockResolvedValueOnce({ _id: "prop1" });
      Unit.create.mockResolvedValueOnce({ _id: "u1", status: "VACANT" });

      const result = await createUnit({
        ownerId: "o1",
        propertyId: "prop1",
        unitName: "1A",
        monthlyRent: 5000,
        advanceAmount: 10000,
      });

      expect(Unit.create).toHaveBeenCalledWith(
        expect.objectContaining({ status: "VACANT", unitName: "1A" }),
      );
      expect(result.status).toBe("VACANT");
    });

    it("should throw 404 when property not found", async () => {
      Property.findOne.mockResolvedValueOnce(null);

      await expect(
        createUnit({
          ownerId: "o1",
          propertyId: "p1",
          unitName: "1A",
          monthlyRent: 1,
          advanceAmount: 1,
        }),
      ).rejects.toEqual({ statusCode: 404, message: "PROPERTY_NOT_FOUND" });
    });
  });

  describe("getUnitsByProperty", () => {
    it("should return units when property exists", async () => {
      Property.findOne.mockResolvedValueOnce({ _id: "prop1" });
      Unit.find.mockReturnValueOnce({
        sort: jest.fn().mockResolvedValueOnce([{ _id: "u1" }]),
      });

      const result = await getUnitsByProperty({
        ownerId: "o1",
        propertyId: "prop1",
      });

      expect(result).toEqual([{ _id: "u1" }]);
    });

    it("should throw 404 when property not found", async () => {
      Property.findOne.mockResolvedValueOnce(null);

      await expect(
        getUnitsByProperty({ ownerId: "o1", propertyId: "p1" }),
      ).rejects.toEqual({ statusCode: 404, message: "PROPERTY_NOT_FOUND" });
    });
  });

  describe("updateUnit", () => {
    it("should update provided fields and save", async () => {
      const mockUnit = {
        _id: "u1",
        unitName: "1A",
        monthlyRent: 1000,
        advanceAmount: 2000,
        save: jest.fn(),
      };
      Unit.findOne.mockResolvedValueOnce(mockUnit);

      const result = await updateUnit({
        ownerId: "o1",
        unitId: "u1",
        monthlyRent: 1500,
      });

      expect(mockUnit.monthlyRent).toBe(1500);
      expect(mockUnit.unitName).toBe("1A"); // unchanged
      expect(mockUnit.save).toHaveBeenCalled();
      expect(result).toBe(mockUnit);
    });

    it("should throw 404 when unit not found", async () => {
      Unit.findOne.mockResolvedValueOnce(null);

      await expect(
        updateUnit({ ownerId: "o1", unitId: "u1", unitName: "2B" }),
      ).rejects.toEqual({
        statusCode: 404,
        message: "UNIT_NOT_FOUND",
      });
    });
  });

  describe("deleteUnit", () => {
    it("should delete a VACANT unit", async () => {
      const mockUnit = { _id: "u1", status: "VACANT", deleteOne: jest.fn() };
      Unit.findOne.mockResolvedValueOnce(mockUnit);

      const result = await deleteUnit({ ownerId: "o1", unitId: "u1" });

      expect(mockUnit.deleteOne).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });

    it("should throw 400 when unit is occupied", async () => {
      Unit.findOne.mockResolvedValueOnce({ _id: "u1", status: "OCCUPIED" });

      await expect(deleteUnit({ ownerId: "o1", unitId: "u1" })).rejects.toEqual(
        {
          statusCode: 400,
          message: "UNIT_NOT_VACANT",
        },
      );
    });

    it("should throw 404 when unit not found", async () => {
      Unit.findOne.mockResolvedValueOnce(null);

      await expect(deleteUnit({ ownerId: "o1", unitId: "u1" })).rejects.toEqual(
        {
          statusCode: 404,
          message: "UNIT_NOT_FOUND",
        },
      );
    });
  });
});
