import * as propertyService from "../../../src/modules/property/property.service.js";

describe.skip("Property Service - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createProperty", () => {
    it("should successfully create a new property", async () => {
      const propertyData = {
        ownerId: "507f1f77bcf86cd799439011",
        name: "Downtown Apartment Building",
        address: "123 Main St, New York, NY",
      };

      const createdProperty = {
        _id: "607f1f77bcf86cd799439011",
        ...propertyData,
        createdAt: new Date(),
      };

      Property.create.mockResolvedValueOnce(createdProperty);

      const result = await propertyService.createProperty(propertyData);

      expect(Property.create).toHaveBeenCalledWith(propertyData);
      expect(result).toEqual(createdProperty);
    });

    it("should handle creation errors", async () => {
      const propertyData = {
        ownerId: "507f1f77bcf86cd799439011",
        name: "Downtown Apartment Building",
        address: "123 Main St, New York, NY",
      };

      const error = new Error("Database error");
      Property.create.mockRejectedValueOnce(error);

      await expect(
        propertyService.createProperty(propertyData),
      ).rejects.toThrow(error);
    });
  });

  describe("getPropertiesByOwner", () => {
    it("should retrieve all properties for an owner", async () => {
      const ownerId = "507f1f77bcf86cd799439011";
      const mockProperties = [
        {
          _id: "607f1f77bcf86cd799439011",
          ownerId,
          name: "Property 1",
          address: "Address 1",
        },
        {
          _id: "607f1f77bcf86cd799439012",
          ownerId,
          name: "Property 2",
          address: "Address 2",
        },
      ];

      Property.find.mockResolvedValueOnce(mockProperties);

      const result = await propertyService.getPropertiesByOwner({ ownerId });

      expect(Property.find).toHaveBeenCalledWith({ ownerId });
      expect(result).toEqual(mockProperties);
    });

    it("should return empty array when owner has no properties", async () => {
      const ownerId = "507f1f77bcf86cd799439011";
      Property.find.mockResolvedValueOnce([]);

      const result = await propertyService.getPropertiesByOwner({ ownerId });

      expect(result).toEqual([]);
    });
  });

  describe("deleteProperty", () => {
    it("should successfully delete a property", async () => {
      const ownerId = "507f1f77bcf86cd799439011";
      const propertyId = "607f1f77bcf86cd799439011";

      Property.findByIdAndDelete.mockResolvedValueOnce({
        _id: propertyId,
        ownerId,
      });

      await propertyService.deleteProperty({ ownerId, propertyId });

      expect(Property.findByIdAndDelete).toHaveBeenCalledWith(propertyId);
    });

    it("should throw error when property not found", async () => {
      const ownerId = "507f1f77bcf86cd799439011";
      const propertyId = "nonexistent-id";

      Property.findByIdAndDelete.mockResolvedValueOnce(null);

      await expect(
        propertyService.deleteProperty({ ownerId, propertyId }),
      ).rejects.toEqual({
        statusCode: 404,
        message: "Property not found",
      });
    });
  });
});
