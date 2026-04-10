# 📄 Document Upload Feature - Implementation Guide

## 🎯 Overview

Complete implementation of the document upload and management feature for the Corbel property management system, following V1.0.0 architecture patterns.

**Status:** ✅ Implementation Ready  
**Version:** 1.0.0  
**Date:** January 29, 2026

---

## 📦 What's Been Created

### Core Files (8 total)

#### 1. **Model Layer**
- `UnitDocument.model.js` - Mongoose schema with indexes, virtuals, and static methods

#### 2. **Middleware Layer**
- `upload.middleware.js` - Multer configuration with file validation and error handling

#### 3. **Service Layer**
- `document.service.js` - Business logic for all document operations

#### 4. **Controller Layer**
- `document.controller.js` - HTTP request/response handlers

#### 5. **Routes Layer**
- `document.routes.js` - API endpoint definitions

#### 6. **Validation Layer**
- `document.validation.js` - Input validation middleware

#### 7. **Test Files**
- `document.service.test.js` - Unit tests (70+ test cases)
- `document.integration.test.js` - Integration tests (20+ test cases)

---

## 📂 File Placement in Your Project

```
backend/
├── src/
│   ├── models/
│   │   └── UnitDocument.model.js          ← Place here
│   │
│   ├── middleware/
│   │   └── upload.middleware.js           ← Place here
│   │
│   └── modules/
│       └── document/                       ← Create this folder
│           ├── document.controller.js
│           ├── document.service.js
│           ├── document.routes.js
│           └── document.validation.js
│
├── tests/
│   ├── unit/
│   │   └── modules/
│   │       └── document.service.test.js   ← Place here
│   │
│   └── integration/
│       └── document.integration.test.js    ← Place here
│
└── uploads/
    └── documents/                          ← Auto-created on first upload
```

---

## 🔧 Installation Steps

### Step 1: Install Required Dependency

```bash
cd backend
npm install multer
```

### Step 2: Copy Files to Project

Move all created files to their respective locations as shown in the structure above.

### Step 3: Register Routes in App

In your `backend/src/routes/index.js` or `backend/src/app.js`, add:

```javascript
import documentRoutes from './modules/document/document.routes.js';

// ... other route imports

app.use('/api/v1/documents', documentRoutes);
```

### Step 4: Create Uploads Directory

```bash
mkdir -p backend/uploads/documents
```

### Step 5: Update .gitignore

Add to your `.gitignore`:

```
# Uploaded files (don't commit actual uploads)
uploads/documents/*
!uploads/documents/.gitkeep

# But keep the directory structure
!uploads/documents/.gitkeep
```

Create `.gitkeep`:

```bash
touch backend/uploads/documents/.gitkeep
```

---

## 🔐 Security Features Implemented

### ✅ Authentication & Authorization
- All endpoints require JWT authentication
- Owner identity from `req.owner` (never from client)
- Cross-owner access prevented at service layer
- File ownership validated before all operations

### ✅ File Upload Security
- MIME type validation (whitelist only)
- File extension verification
- 10MB file size limit
- Secure filename generation (no user input)
- Files stored outside web root

### ✅ Input Validation
- Required field validation
- String length limits
- Date format validation
- ObjectId format validation
- Document type enum validation

### ✅ Error Handling
- Transactional file operations
- Automatic cleanup on failure
- Consistent error responses
- No information leakage in errors

---

## 📊 API Endpoints Summary

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/documents/upload` | Upload document | Required |
| GET | `/api/v1/documents/unit/:unitId` | Get unit documents | Required |
| GET | `/api/v1/documents/property/:propertyId` | Get property documents | Required |
| GET | `/api/v1/documents/:documentId` | Get single document | Required |
| GET | `/api/v1/documents/:documentId/download` | Download file | Required |
| PUT | `/api/v1/documents/:documentId` | Update metadata | Required |
| DELETE | `/api/v1/documents/:documentId` | Delete document | Required |
| GET | `/api/v1/documents/expiring/list` | Get expiring docs | Required |
| GET | `/api/v1/documents/statistics/summary` | Get statistics | Required |

---

## 🧪 Testing

### Run Unit Tests

```bash
npm test -- document.service.test.js
```

**Expected:** 70+ tests passing

### Run Integration Tests

```bash
npm run test:integration -- document.integration.test.js
```

**Expected:** 20+ tests passing

### Check Coverage

```bash
npm test -- --coverage document
```

**Expected:** >80% coverage

---

## 📝 Usage Examples

### 1. Upload Document (cURL)

```bash
curl -X POST http://localhost:3000/api/v1/documents/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "propertyId=60d5ec49c1234567890abcde" \
  -F "unitId=60d5ec49c1234567890abcdf" \
  -F "documentType=LEASE_AGREEMENT" \
  -F "documentName=Unit 101 Lease Agreement" \
  -F "description=Standard 12-month lease" \
  -F "expiryDate=2025-12-31" \
  -F "tags=lease,unit101,2024" \
  -F "document=@/path/to/lease.pdf"
```

### 2. Upload Document (JavaScript/Axios)

```javascript
const formData = new FormData();
formData.append('propertyId', '60d5ec49c1234567890abcde');
formData.append('unitId', '60d5ec49c1234567890abcdf');
formData.append('documentType', 'LEASE_AGREEMENT');
formData.append('documentName', 'Unit 101 Lease Agreement');
formData.append('description', 'Standard 12-month lease');
formData.append('expiryDate', '2025-12-31');
formData.append('tags', 'lease,unit101,2024');
formData.append('document', fileInput.files[0]);

const response = await axios.post(
  'http://localhost:3000/api/v1/documents/upload',
  formData,
  {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  }
);
```

### 3. Get Unit Documents

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:3000/api/v1/documents/unit/60d5ec49c1234567890abcdf"
```

### 4. Download Document

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:3000/api/v1/documents/60d5ec49c1234567890abc00/download" \
  --output lease-agreement.pdf
```

---

## 🔍 Key Implementation Details

### Soft Delete Strategy

Documents are soft-deleted (marked as `isActive: false`) rather than hard-deleted:

```javascript
// Soft delete preserves audit trail
document.isActive = false;
await document.save();

// Physical file is still removed
await deleteFile(document.filePath);
```

### File Naming Convention

Files are named to prevent collisions and maintain security:

```
{unitId}_{documentType}_{timestamp}.{extension}

Example:
60d5ec49_LEASE_AGREEMENT_1699564800000.pdf
```

### Tag Handling

Tags can be provided as:
- Comma-separated string: `"lease,unit101,2024"`
- Array: `["lease", "unit101", "2024"]`

Both are parsed and stored as arrays.

### Expiry Tracking

Virtual fields calculate expiry status:

```javascript
// Check if expired
document.isExpired  // boolean

// Days until expiry
document.daysUntilExpiry  // number or null
```

---

## 📈 Database Indexes

Optimized for common query patterns:

```javascript
// Owner-scoped queries (most common)
{ ownerId: 1, unitId: 1 }
{ ownerId: 1, propertyId: 1 }

// Filtering and search
{ documentType: 1, isActive: 1 }
{ expiryDate: 1, isActive: 1 }

// Prevent duplicate filenames
{ fileName: 1 } // unique
```

---

## 🚨 Error Codes Reference

| Code | HTTP | Description |
|------|------|-------------|
| `DOCUMENT_UPLOADED` | 201 | Upload successful |
| `SUCCESS` | 200 | Operation successful |
| `BAD_REQUEST` | 400 | Invalid input |
| `VALIDATION_ERROR` | 400 | Validation failed |
| `UNAUTHORIZED` | 401 | Not authenticated |
| `PROPERTY_NOT_FOUND` | 404 | Property not found |
| `UNIT_NOT_FOUND` | 404 | Unit not found |
| `DOCUMENT_NOT_FOUND` | 404 | Document not found |
| `FILE_TOO_LARGE` | 413 | File > 10MB |
| `INVALID_FILE_TYPE` | 400 | Unsupported file type |
| `SERVER_ERROR` | 500 | Internal error |

---

## 🎯 Testing Checklist

Before deploying:

- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] Coverage > 80%
- [ ] Manual API testing completed
- [ ] File upload tested with various formats
- [ ] File size limit tested
- [ ] Authorization tested (cross-owner access)
- [ ] Error scenarios tested
- [ ] File deletion tested
- [ ] Download tested
- [ ] Expiry tracking tested

---

## 🔄 Integration with Existing Modules

### With Unit Module

Documents are linked to units via `unitId`:

```javascript
// When deleting a unit, you might want to:
const documents = await UnitDocument.find({ unitId, isActive: true });
documents.forEach(doc => doc.softDelete());
```

### With Property Module

Documents can be queried by property:

```javascript
// Get all documents for a property
const docs = await documentService.getPropertyDocuments(ownerId, propertyId);
```

### With Tenant Module

Documents can track tenancy periods:

```javascript
// When tenant changes, update lease documents
await documentService.updateDocument(ownerId, leaseDocId, {
  description: `Lease ended on ${tenancyEndDate}`,
});
```

---

## 🚀 Future Enhancements (V2+)

Potential extensions:

- [ ] Cloud storage (AWS S3, Google Cloud Storage)
- [ ] Document versioning
- [ ] OCR for text extraction
- [ ] Document templates
- [ ] Bulk upload
- [ ] Document sharing with tenants
- [ ] Email notifications for expiring documents
- [ ] Digital signatures
- [ ] Document encryption at rest

---

## 📚 Additional Resources

### Related Documentation

- See `docs/propert-unit-api.md` for Property & Unit APIs
- See `docs/tenant-domain.md` for Tenant integration
- See `docs/testing-guide.md` for testing best practices

### Supported File Types

```javascript
PDF       - application/pdf
Word      - .doc, .docx
Excel     - .xls, .xlsx
Images    - .jpg, .png, .gif
Text      - .txt
```

---

## ✅ Implementation Checklist

- [x] Model created with schema and indexes
- [x] Upload middleware with Multer
- [x] Service layer with business logic
- [x] Controller with HTTP handlers
- [x] Routes with authentication
- [x] Validation middleware
- [x] Unit tests (70+ cases)
- [x] Integration tests (20+ cases)
- [x] Documentation complete
- [ ] Files moved to project
- [ ] Routes registered in app
- [ ] Dependencies installed
- [ ] Tests run and passing
- [ ] Manual testing completed

---

## 🎉 Summary

You now have:

✅ **Complete document upload system** with file validation  
✅ **8 production-ready files** following your project patterns  
✅ **90+ test cases** with comprehensive coverage  
✅ **Security-first design** with owner-scoped access  
✅ **Flexible querying** with filters and statistics  
✅ **Soft delete** preserving audit trail  
✅ **Expiry tracking** for time-sensitive documents  
✅ **RESTful API** consistent with existing modules  

**Next Step:** Move files to project and run tests! 🚀

---

**Created:** January 29, 2026  
**Version:** 1.0.0  
**Status:** ✅ Ready for Integration
