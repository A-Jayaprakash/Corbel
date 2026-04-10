import {
  jest,
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
} from "@jest/globals";

jest.unstable_mockModule("../../../src/models/Property.model.js", () => ({
  Property: { find: jest.fn(), findOne: jest.fn(), create: jest.fn() },
}));
jest.unstable_mockModule("../../../src/models/Unit.model.js", () => ({
  Unit: { countDocuments: jest.fn() },
}));

let createProperty,
  getPropertiesByOwner,
  updateProperty,
  deleteProperty,
  Property,
  Unit;

beforeAll(async () => {
  ({ createProperty, getPropertiesByOwner, updateProperty, deleteProperty } =
    await import("../../../src/modules/property/property.service.js"));
  ({ Property } = await import("../../../src/models/Property.model.js"));
  ({ Unit } = await import("../../../src/models/Unit.model.js"));
});

beforeEach(() => jest.clearAllMocks());

describe("Property Service", () => {
  describe("createProperty", () => {
    it("should create and return a property", async () => {
      const data = { ownerId: "o1", name: "Block A", address: "123 St" };
      Property.create.mockResolvedValueOnce({ _id: "p1", ...data });

      const result = await createProperty(data);

      expect(Property.create).toHaveBeenCalledWith(data);
      expect(result._id).toBe("p1");
    });
  });

  describe("getPropertiesByOwner", () => {
    it("should return paginated properties", async () => {
      const props = [{ _id: "p1" }, { _id: "p2" }];
      const mockChain = { sort: jest.fn(), skip: jest.fn(), limit: jest.fn() };
      mockChain.sort.mockReturnValue(mockChain);
      mockChain.skip.mockReturnValue(mockChain);
      mockChain.limit.mockResolvedValueOnce(props);
      Property.find.mockReturnValueOnce(mockChain);
      Property.countDocuments = jest.fn().mockResolvedValueOnce(2);

      const result = await getPropertiesByOwner({ ownerId: "o1" });

      expect(Property.find).toHaveBeenCalledWith({ ownerId: "o1" });
      expect(result.data).toEqual(props);
      expect(result.meta.total).toBe(2);
    });
  });

  describe("updateProperty", () => {
    it("should update and return the property", async () => {
      const mockProp = {
        _id: "p1",
        name: "Old",
        address: "Old Addr",
        save: jest.fn(),
      };
      Property.findOne.mockResolvedValueOnce(mockProp);

      const result = await updateProperty({
        ownerId: "o1",
        propertyId: "p1",
        name: "New",
      });

      expect(mockProp.name).toBe("New");
      expect(mockProp.save).toHaveBeenCalled();
      expect(result).toBe(mockProp);
    });

    it("should throw 404 when property not found", async () => {
      Property.findOne.mockResolvedValueOnce(null);

      await expect(
        updateProperty({ ownerId: "o1", propertyId: "p1", name: "New" }),
      ).rejects.toEqual({ statusCode: 404, message: "PROPERTY_NOT_FOUND" });
    });
  });

  describe("deleteProperty", () => {
    it("should delete property when no units exist", async () => {
      const mockProp = { _id: "p1", deleteOne: jest.fn() };
      Property.findOne.mockResolvedValueOnce(mockProp);
      Unit.countDocuments.mockResolvedValueOnce(0);

      const result = await deleteProperty({ ownerId: "o1", propertyId: "p1" });

      expect(mockProp.deleteOne).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });

    it("should throw 400 when property has units", async () => {
      Property.findOne.mockResolvedValueOnce({ _id: "p1" });
      Unit.countDocuments.mockResolvedValueOnce(2);

      await expect(
        deleteProperty({ ownerId: "o1", propertyId: "p1" }),
      ).rejects.toEqual({
        statusCode: 400,
        message: "PROPERTY_HAS_UNITS",
      });
    });

    it("should throw 404 when property not found", async () => {
      Property.findOne.mockResolvedValueOnce(null);

      await expect(
        deleteProperty({ ownerId: "o1", propertyId: "p1" }),
      ).rejects.toEqual({
        statusCode: 404,
        message: "PROPERTY_NOT_FOUND",
      });
    });
  });
});
