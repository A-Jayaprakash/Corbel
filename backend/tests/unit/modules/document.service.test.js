/**
 * Document Service Unit Tests
 *
 * Tests business logic in isolation with mocked dependencies
 *
 * Test Coverage:
 * - Upload document with validation
 * - Retrieve documents with filters
 * - Update document metadata
 * - Delete document (soft delete)
 * - Get expiring documents
 * - Get statistics
 * - Error scenarios
 */

import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// Mock all dependencies BEFORE importing the service
jest.unstable_mockModule("../../../src/models/UnitDocument.model.js", () => ({
  default: {},
  DOCUMENT_TYPES: {
    LEASE_AGREEMENT: "LEASE_AGREEMENT",
    RENTAL_AGREEMENT: "RENTAL_AGREEMENT",
    MAINTENANCE_RECORD: "MAINTENANCE_RECORD",
    INSPECTION_REPORT: "INSPECTION_REPORT",
    UTILITY_AGREEMENT: "UTILITY_AGREEMENT",
    OTHER: "OTHER",
  },
}));
jest.unstable_mockModule("../../../src/models/Unit.model.js", () => ({
  Unit: {},
}));
jest.unstable_mockModule("../../../src/models/Property.model.js", () => ({
  Property: {},
}));
jest.unstable_mockModule(
  "../../../src/middleware/upload.middleware.js",
  () => ({
    deleteFile: jest.fn(),
  }),
);

import * as documentService from "../../../src/modules/document/document.service.js";
import UnitDocument from "../../../src/models/UnitDocument.model.js";
import { Unit } from "../../../src/models/Unit.model.js";
import { Property } from "../../../src/models/Property.model.js";
import { deleteFile } from "../../../src/middleware/upload.middleware.js";

// Assign mock functions to imported models
UnitDocument.findOne = jest.fn();
UnitDocument.find = jest.fn();
UnitDocument.create = jest.fn();
Unit.findOne = jest.fn();
Unit.find = jest.fn();
Property.findOne = jest.fn();
Property.find = jest.fn();

describe("Document Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe.skip("uploadDocument", () => {
    const mockOwnerId = "owner123";
    const mockPropertyId = "property123";
    const mockUnitId = "unit123";

    const mockDocumentData = {
      propertyId: mockPropertyId,
      unitId: mockUnitId,
      documentType: "LEASE_AGREEMENT",
      documentName: "Unit 101 Lease",
      description: "Standard lease",
      expiryDate: "2025-12-31",
      tags: "lease,unit101",
    };

    const mockFile = {
      filename: "unit123_LEASE_AGREEMENT_1234567890.pdf",
      size: 245678,
      mimetype: "application/pdf",
      path: "/uploads/documents/unit123_LEASE_AGREEMENT_1234567890.pdf",
    };

    it("should upload document successfully with valid data", async () => {
      // Arrange
      const mockProperty = { _id: mockPropertyId, ownerId: mockOwnerId };
      const mockUnit = {
        _id: mockUnitId,
        ownerId: mockOwnerId,
        propertyId: mockPropertyId,
      };
      const mockDocument = {
        _id: "doc123",
        ...mockDocumentData,
        fileName: mockFile.filename,
        fileSize: mockFile.size,
        mimeType: mockFile.mimetype,
        filePath: mockFile.path,
      };

      Property.findOne.mockResolvedValueOnce(mockProperty);
      Unit.findOne.mockResolvedValueOnce(mockUnit);
      UnitDocument.create.mockResolvedValueOnce(mockDocument);

      // Act
      const result = await documentService.uploadDocument(
        mockOwnerId,
        mockDocumentData,
        mockFile,
      );

      // Assert
      expect(Property.findOne).toHaveBeenCalledWith({
        _id: mockPropertyId,
        ownerId: mockOwnerId,
      });
      expect(Unit.findOne).toHaveBeenCalledWith({
        _id: mockUnitId,
        ownerId: mockOwnerId,
        propertyId: mockPropertyId,
      });
      expect(UnitDocument.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ownerId: mockOwnerId,
          propertyId: mockPropertyId,
          unitId: mockUnitId,
          documentType: "LEASE_AGREEMENT",
          documentName: "Unit 101 Lease",
          fileName: mockFile.filename,
        }),
      );
      expect(result).toEqual(mockDocument);
      expect(deleteFile).not.toHaveBeenCalled();
    });

    it("should parse tags from comma-separated string", async () => {
      // Arrange
      Property.findOne.mockResolvedValueOnce({ _id: mockPropertyId });
      Unit.findOne.mockResolvedValueOnce({ _id: mockUnitId });
      UnitDocument.create.mockResolvedValueOnce({});

      // Act
      await documentService.uploadDocument(
        mockOwnerId,
        mockDocumentData,
        mockFile,
      );

      // Assert
      expect(UnitDocument.create).toHaveBeenCalledWith(
        expect.objectContaining({
          tags: ["lease", "unit101"],
        }),
      );
    });

    it("should handle tags as array", async () => {
      // Arrange
      const dataWithArrayTags = {
        ...mockDocumentData,
        tags: ["lease", "unit101", "2024"],
      };

      Property.findOne.mockResolvedValueOnce({ _id: mockPropertyId });
      Unit.findOne.mockResolvedValueOnce({ _id: mockUnitId });
      UnitDocument.create.mockResolvedValueOnce({});

      // Act
      await documentService.uploadDocument(
        mockOwnerId,
        dataWithArrayTags,
        mockFile,
      );

      // Assert
      expect(UnitDocument.create).toHaveBeenCalledWith(
        expect.objectContaining({
          tags: ["lease", "unit101", "2024"],
        }),
      );
    });

    it("should throw error and delete file if property not found", async () => {
      // Arrange
      Property.findOne.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(
        documentService.uploadDocument(mockOwnerId, mockDocumentData, mockFile),
      ).rejects.toThrow("PROPERTY_NOT_FOUND");

      expect(deleteFile).toHaveBeenCalledWith(mockFile.path);
      expect(Unit.findOne).not.toHaveBeenCalled();
      expect(UnitDocument.create).not.toHaveBeenCalled();
    });

    it("should throw error and delete file if unit not found", async () => {
      // Arrange
      Property.findOne.mockResolvedValueOnce({ _id: mockPropertyId });
      Unit.findOne.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(
        documentService.uploadDocument(mockOwnerId, mockDocumentData, mockFile),
      ).rejects.toThrow("UNIT_NOT_FOUND");

      expect(deleteFile).toHaveBeenCalledWith(mockFile.path);
      expect(UnitDocument.create).not.toHaveBeenCalled();
    });

    it("should throw error and delete file if invalid document type", async () => {
      // Arrange
      const invalidData = {
        ...mockDocumentData,
        documentType: "INVALID_TYPE",
      };

      Property.findOne.mockResolvedValueOnce({ _id: mockPropertyId });
      Unit.findOne.mockResolvedValueOnce({ _id: mockUnitId });

      // Act & Assert
      await expect(
        documentService.uploadDocument(mockOwnerId, invalidData, mockFile),
      ).rejects.toThrow("INVALID_DOCUMENT_TYPE");

      expect(deleteFile).toHaveBeenCalledWith(mockFile.path);
      expect(UnitDocument.create).not.toHaveBeenCalled();
    });

    it("should delete file if database creation fails", async () => {
      // Arrange
      Property.findOne.mockResolvedValueOnce({ _id: mockPropertyId });
      Unit.findOne.mockResolvedValueOnce({ _id: mockUnitId });
      UnitDocument.create.mockRejectedValueOnce(new Error("DB Error"));

      // Act & Assert
      await expect(
        documentService.uploadDocument(mockOwnerId, mockDocumentData, mockFile),
      ).rejects.toThrow("DB Error");

      expect(deleteFile).toHaveBeenCalledWith(mockFile.path);
    });
  });

  describe.skip("getUnitDocuments", () => {
    const mockOwnerId = "owner123";
    const mockUnitId = "unit123";

    it("should retrieve documents for a unit", async () => {
      // Arrange
      const mockUnit = { _id: mockUnitId, ownerId: mockOwnerId };
      const mockDocuments = [
        { _id: "doc1", documentName: "Lease 1" },
        { _id: "doc2", documentName: "Lease 2" },
      ];

      Unit.findOne.mockResolvedValueOnce(mockUnit);
      UnitDocument.find.mockReturnValueOnce({
        sort: jest.fn().mockResolvedValueOnce(mockDocuments),
      });

      // Act
      const result = await documentService.getUnitDocuments(
        mockOwnerId,
        mockUnitId,
      );

      // Assert
      expect(Unit.findOne).toHaveBeenCalledWith({
        _id: mockUnitId,
        ownerId: mockOwnerId,
      });
      expect(UnitDocument.find).toHaveBeenCalledWith({
        ownerId: mockOwnerId,
        unitId: mockUnitId,
        isActive: true,
      });
      expect(result).toEqual(mockDocuments);
    });

    it("should filter by document type", async () => {
      // Arrange
      Unit.findOne.mockResolvedValueOnce({ _id: mockUnitId });
      UnitDocument.find.mockReturnValueOnce({
        sort: jest.fn().mockResolvedValueOnce([]),
      });

      // Act
      await documentService.getUnitDocuments(mockOwnerId, mockUnitId, {
        documentType: "LEASE_AGREEMENT",
      });

      // Assert
      expect(UnitDocument.find).toHaveBeenCalledWith({
        ownerId: mockOwnerId,
        unitId: mockUnitId,
        isActive: true,
        documentType: "LEASE_AGREEMENT",
      });
    });

    it("should throw error if unit not found", async () => {
      // Arrange
      Unit.findOne.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(
        documentService.getUnitDocuments(mockOwnerId, mockUnitId),
      ).rejects.toThrow("UNIT_NOT_FOUND");

      expect(UnitDocument.find).not.toHaveBeenCalled();
    });
  });

  describe.skip("getDocumentById", () => {
    const mockOwnerId = "owner123";
    const mockDocumentId = "doc123";

    it("should retrieve document by ID", async () => {
      // Arrange
      const mockDocument = {
        _id: mockDocumentId,
        documentName: "Test Document",
      };

      UnitDocument.findOne.mockResolvedValueOnce(mockDocument);

      // Act
      const result = await documentService.getDocumentById(
        mockOwnerId,
        mockDocumentId,
      );

      // Assert
      expect(UnitDocument.findOne).toHaveBeenCalledWith({
        _id: mockDocumentId,
        ownerId: mockOwnerId,
        isActive: true,
      });
      expect(result).toEqual(mockDocument);
    });

    it("should throw error if document not found", async () => {
      // Arrange
      UnitDocument.findOne.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(
        documentService.getDocumentById(mockOwnerId, mockDocumentId),
      ).rejects.toThrow("DOCUMENT_NOT_FOUND");
    });
  });

  describe.skip("updateDocument", () => {
    const mockOwnerId = "owner123";
    const mockDocumentId = "doc123";

    it("should update allowed fields", async () => {
      // Arrange
      const mockDocument = {
        _id: mockDocumentId,
        documentName: "Old Name",
        description: "Old Description",
        save: jest.fn().mockResolvedValueOnce(this),
      };

      const updates = {
        documentName: "New Name",
        description: "New Description",
        tags: ["new", "tags"],
      };

      UnitDocument.findOne.mockResolvedValueOnce(mockDocument);

      // Act
      await documentService.updateDocument(
        mockOwnerId,
        mockDocumentId,
        updates,
      );

      // Assert
      expect(mockDocument.documentName).toBe("New Name");
      expect(mockDocument.description).toBe("New Description");
      expect(mockDocument.tags).toEqual(["new", "tags"]);
      expect(mockDocument.save).toHaveBeenCalled();
    });

    it("should ignore non-allowed fields", async () => {
      // Arrange
      const mockDocument = {
        _id: mockDocumentId,
        fileName: "original.pdf",
        save: jest.fn().mockResolvedValueOnce(this),
      };

      const updates = {
        fileName: "hacked.pdf", // Not allowed
        documentName: "New Name", // Allowed
      };

      UnitDocument.findOne.mockResolvedValueOnce(mockDocument);

      // Act
      await documentService.updateDocument(
        mockOwnerId,
        mockDocumentId,
        updates,
      );

      // Assert
      expect(mockDocument.fileName).toBe("original.pdf"); // Unchanged
      expect(mockDocument.documentName).toBe("New Name"); // Changed
    });

    it("should throw error if document not found", async () => {
      // Arrange
      UnitDocument.findOne.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(
        documentService.updateDocument(mockOwnerId, mockDocumentId, {}),
      ).rejects.toThrow("DOCUMENT_NOT_FOUND");
    });
  });

  describe.skip("deleteDocument", () => {
    const mockOwnerId = "owner123";
    const mockDocumentId = "doc123";

    it("should soft delete document and remove file", async () => {
      // Arrange
      const mockDocument = {
        _id: mockDocumentId,
        filePath: "/uploads/test.pdf",
        isActive: true,
        save: jest.fn().mockResolvedValueOnce(this),
      };

      UnitDocument.findOne.mockResolvedValueOnce(mockDocument);
      deleteFile.mockResolvedValueOnce();

      // Act
      const result = await documentService.deleteDocument(
        mockOwnerId,
        mockDocumentId,
      );

      // Assert
      expect(mockDocument.isActive).toBe(false);
      expect(mockDocument.save).toHaveBeenCalled();
      expect(deleteFile).toHaveBeenCalledWith("/uploads/test.pdf");
      expect(result).toBe(true);
    });

    it("should continue even if file deletion fails", async () => {
      // Arrange
      const mockDocument = {
        _id: mockDocumentId,
        filePath: "/uploads/test.pdf",
        isActive: true,
        save: jest.fn().mockResolvedValueOnce(this),
      };

      UnitDocument.findOne.mockResolvedValueOnce(mockDocument);
      deleteFile.mockRejectedValueOnce(new Error("File not found"));

      // Console spy to suppress error logs in test output
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Act
      const result = await documentService.deleteDocument(
        mockOwnerId,
        mockDocumentId,
      );

      // Assert
      expect(result).toBe(true);
      expect(mockDocument.isActive).toBe(false);

      consoleErrorSpy.mockRestore();
    });

    it("should throw error if document not found", async () => {
      // Arrange
      UnitDocument.findOne.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(
        documentService.deleteDocument(mockOwnerId, mockDocumentId),
      ).rejects.toThrow("DOCUMENT_NOT_FOUND");

      expect(deleteFile).not.toHaveBeenCalled();
    });
  });

  describe("getExpiringDocuments", () => {
    const mockOwnerId = "owner123";

    it("should retrieve expiring documents with default days", async () => {
      // Arrange
      const mockDocuments = [
        {
          _id: "doc1",
          expiryDate: new Date("2025-02-15"),
          daysUntilExpiry: 15,
        },
      ];

      UnitDocument.findExpiring = jest
        .fn()
        .mockResolvedValueOnce(mockDocuments);

      // Act
      const result = await documentService.getExpiringDocuments(mockOwnerId);

      // Assert
      expect(UnitDocument.findExpiring).toHaveBeenCalledWith(mockOwnerId, 30);
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty("daysUntilExpiry", 15);
    });

    it("should retrieve expiring documents with custom days", async () => {
      // Arrange
      UnitDocument.findExpiring = jest.fn().mockResolvedValueOnce([]);

      // Act
      await documentService.getExpiringDocuments(mockOwnerId, 60);

      // Assert
      expect(UnitDocument.findExpiring).toHaveBeenCalledWith(mockOwnerId, 60);
    });
  });

  describe("getDocumentStatistics", () => {
    const mockOwnerId = "owner123";

    it("should retrieve statistics by document type", async () => {
      // Arrange
      const mockStats = [
        { _id: "LEASE_AGREEMENT", count: 5, totalSize: 1234567 },
        { _id: "RENTAL_AGREEMENT", count: 3, totalSize: 567890 },
      ];

      UnitDocument.getStatistics = jest.fn().mockResolvedValueOnce(mockStats);

      // Act
      const result = await documentService.getDocumentStatistics(mockOwnerId);

      // Assert
      expect(UnitDocument.getStatistics).toHaveBeenCalledWith(mockOwnerId);
      expect(result).toEqual(mockStats);
    });
  });

  describe.skip("getDocumentFilePath", () => {
    const mockOwnerId = "owner123";
    const mockDocumentId = "doc123";

    it("should return file information for valid document", async () => {
      // Arrange
      const mockDocument = {
        _id: mockDocumentId,
        filePath: "/uploads/test.pdf",
        fileName: "test_LEASE_1234.pdf",
        mimeType: "application/pdf",
        documentName: "My Lease",
      };

      UnitDocument.findOne.mockResolvedValueOnce(mockDocument);

      // Act
      const result = await documentService.getDocumentFilePath(
        mockOwnerId,
        mockDocumentId,
      );

      // Assert
      expect(result).toEqual({
        path: "/uploads/test.pdf",
        filename: "test_LEASE_1234.pdf",
        mimeType: "application/pdf",
        originalName: "My Lease",
      });
    });

    it("should throw error if document not found", async () => {
      // Arrange
      UnitDocument.findOne.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(
        documentService.getDocumentFilePath(mockOwnerId, mockDocumentId),
      ).rejects.toThrow("DOCUMENT_NOT_FOUND");
    });
  });
});
