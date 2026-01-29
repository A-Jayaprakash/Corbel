# Document Upload & Access Feature

## Overview

The Document Upload & Access feature allows property owners to upload, store, manage, and download important paperwork associated with rental units such as lease agreements, rental agreements, maintenance records, inspection reports, and utility agreements.

## Features

### Core Functionality

- ✅ **Upload Documents** - Upload files with validation and storage
- ✅ **Download Documents** - Securely download stored documents
- ✅ **Document Metadata** - Store document type, expiry date, tags, and descriptions
- ✅ **Expiry Tracking** - Track documents expiring within specified timeframe
- ✅ **Document Statistics** - Get insights on document types and storage usage
- ✅ **Soft Delete** - Mark documents as inactive instead of hard delete
- ✅ **Access Control** - Only owners can access their unit documents

### Supported Document Types

- `LEASE_AGREEMENT` - Legal lease agreement documents
- `RENTAL_AGREEMENT` - Rental agreement documents
- `MAINTENANCE_RECORD` - Maintenance and repair records
- `INSPECTION_REPORT` - Property inspection reports
- `UTILITY_AGREEMENT` - Utility service agreements
- `OTHER` - Other miscellaneous documents

### Allowed File Types

- PDF (application/pdf)
- Word Documents (.doc, .docx)
- Excel Spreadsheets (.xls, .xlsx)
- Images (JPEG, PNG, GIF)
- Text Files (.txt)

### File Size Limit

- Maximum: 10MB per file

## API Endpoints

### 1. Upload Document

**POST** `/api/v1/documents/upload`

**Authentication:** Required (Owner)

**Content-Type:** multipart/form-data

**Request Body:**

```json
{
  "propertyId": "60d5ec49c1234567890abcde",
  "unitId": "60d5ec49c1234567890abcdf",
  "documentType": "LEASE_AGREEMENT",
  "documentName": "Unit 101 Lease Agreement",
  "description": "Standard 12-month lease agreement",
  "expiryDate": "2025-12-31",
  "tags": ["lease", "unit-101", "2024"],
  "document": <file>
}
```

**Response:**

```json
{
  "statusCode": 201,
  "message": "DOCUMENT_UPLOADED",
  "description": "Document uploaded successfully",
  "data": {
    "document": {
      "_id": "60d5ec49c1234567890abc00",
      "ownerId": "60d5ec49c1234567890abcd0",
      "unitId": "60d5ec49c1234567890abcdf",
      "propertyId": "60d5ec49c1234567890abcde",
      "documentType": "LEASE_AGREEMENT",
      "documentName": "Unit 101 Lease Agreement",
      "fileName": "60d5ec49c1234567890abcdf_LEASE_AGREEMENT_1699564800000.pdf",
      "fileSize": 245678,
      "mimeType": "application/pdf",
      "description": "Standard 12-month lease agreement",
      "expiryDate": "2025-12-31T00:00:00.000Z",
      "tags": ["lease", "unit-101", "2024"],
      "uploadedBy": "Owner",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

### 2. Get Unit Documents

**GET** `/api/v1/documents/unit/:unitId`

**Authentication:** Required (Owner)

**Query Parameters:**

- `documentType` (optional) - Filter by document type (e.g., LEASE_AGREEMENT)

**Response:**

```json
{
  "statusCode": 200,
  "message": "SUCCESS",
  "description": "Documents retrieved successfully",
  "data": {
    "documents": [
      {
        "_id": "60d5ec49c1234567890abc00",
        "ownerId": "60d5ec49c1234567890abcd0",
        "unitId": "60d5ec49c1234567890abcdf",
        "propertyId": "60d5ec49c1234567890abcde",
        "documentType": "LEASE_AGREEMENT",
        "documentName": "Unit 101 Lease Agreement",
        "fileName": "60d5ec49c1234567890abcdf_LEASE_AGREEMENT_1699564800000.pdf",
        "fileSize": 245678,
        "mimeType": "application/pdf",
        "description": "Standard 12-month lease agreement",
        "expiryDate": "2025-12-31T00:00:00.000Z",
        "tags": ["lease", "unit-101", "2024"],
        "uploadedBy": "Owner",
        "isActive": true,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "count": 1
  }
}
```

---

### 3. Get Document Details

**GET** `/api/v1/documents/:documentId`

**Authentication:** Required (Owner)

**Response:**
Same as individual document object from above endpoints

---

### 4. Download Document

**GET** `/api/v1/documents/:documentId/download`

**Authentication:** Required (Owner)

**Response:** Binary file stream with appropriate Content-Type and Content-Disposition headers

**Example using curl:**

```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3000/api/v1/documents/60d5ec49c1234567890abc00/download" \
  --output lease-agreement.pdf
```

---

### 5. Update Document

**PUT** `/api/v1/documents/:documentId`

**Authentication:** Required (Owner)

**Request Body:**

```json
{
  "documentName": "Updated Name",
  "description": "Updated description",
  "expiryDate": "2025-12-31",
  "tags": ["lease", "updated", "2024"],
  "isActive": true
}
```

**Response:** Updated document object

---

### 6. Delete Document

**DELETE** `/api/v1/documents/:documentId`

**Authentication:** Required (Owner)

**Response:**

```json
{
  "statusCode": 200,
  "message": "SUCCESS",
  "description": "Document deleted successfully"
}
```

**Note:** Documents are soft-deleted (marked as inactive) rather than permanently removed. Files are removed from disk storage.

---

### 7. Get Expiring Documents

**GET** `/api/v1/documents/expiring/list`

**Authentication:** Required (Owner)

**Query Parameters:**

- `daysFromNow` (optional, default: 30) - Number of days to look ahead

**Response:**

```json
{
  "statusCode": 200,
  "message": "SUCCESS",
  "description": "Expiring documents retrieved successfully",
  "data": {
    "documents": [
      {
        "_id": "60d5ec49c1234567890abc00",
        "documentType": "LEASE_AGREEMENT",
        "documentName": "Unit 101 Lease Agreement",
        "expiryDate": "2025-02-15T00:00:00.000Z",
        "daysUntilExpiry": 25
      }
    ],
    "count": 1
  }
}
```

---

### 8. Get Document Statistics

**GET** `/api/v1/documents/statistics/summary`

**Authentication:** Required (Owner)

**Response:**

```json
{
  "statusCode": 200,
  "message": "SUCCESS",
  "description": "Document statistics retrieved successfully",
  "data": {
    "statistics": [
      {
        "_id": "LEASE_AGREEMENT",
        "count": 5,
        "totalSize": 1234567
      },
      {
        "_id": "RENTAL_AGREEMENT",
        "count": 3,
        "totalSize": 567890
      }
    ]
  }
}
```

## Database Schema

### UnitDocument Model

```javascript
{
  ownerId: ObjectId (ref: Owner),
  unitId: ObjectId (ref: Unit),
  propertyId: ObjectId (ref: Property),
  documentType: String (enum: LEASE_AGREEMENT, RENTAL_AGREEMENT, etc.),
  documentName: String,
  fileName: String,
  fileSize: Number,
  mimeType: String,
  filePath: String,
  description: String,
  uploadedBy: String,
  expiryDate: Date (optional),
  isActive: Boolean,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes

- `ownerId` - For quick owner lookups
- `unitId` - For unit document queries
- `documentType, isActive` - For document type filtering
- `ownerId, unitId` - Compound index for efficient unit document queries

## File Storage

### Storage Location

- **Local Storage:** `uploads/documents/` directory
- **File Naming:** `{unitId}_{documentType}_{timestamp}.{extension}`

### Directory Structure

```
uploads/
├── documents/
│   ├── 60d5ec49c1234567890abcdf_LEASE_AGREEMENT_1699564800000.pdf
│   ├── 60d5ec49c1234567890abcdf_RENTAL_AGREEMENT_1699564900000.pdf
│   └── ...
```

### Cleanup Strategy

- Files are deleted from disk when document is deleted
- Database records are soft-deleted (isActive = false)
- Old inactive records can be purged periodically

## Security Considerations

### Access Control

- ✅ Only authenticated owners can access their documents
- ✅ Owners can only access documents for their own units and properties
- ✅ Ownership validation on all endpoints

### File Validation

- ✅ MIME type validation on upload
- ✅ File size limit enforcement (10MB)
- ✅ File extension verification

### Storage Security

- ✅ Files stored outside web root
- ✅ Original filenames not exposed in URLs
- ✅ Downloads require authentication
- ✅ Proper content-type headers set on download

## Error Handling

### Common Errors

**400 Bad Request**

```json
{
  "statusCode": 400,
  "message": "BAD_REQUEST",
  "description": "Missing required fields"
}
```

**401 Unauthorized**

```json
{
  "statusCode": 401,
  "message": "UNAUTHORIZED",
  "description": "Authentication required"
}
```

**404 Not Found**

```json
{
  "statusCode": 404,
  "message": "UNIT_NOT_FOUND",
  "description": "Requested unit does not exist"
}
```

**413 Payload Too Large**

```json
{
  "statusCode": 413,
  "message": "FILE_TOO_LARGE",
  "description": "File exceeds maximum size of 10MB"
}
```

## Usage Examples

### Upload Document (cURL)

```bash
curl -X POST http://localhost:3000/api/v1/documents/upload \
  -H "Authorization: Bearer <token>" \
  -F "propertyId=60d5ec49c1234567890abcde" \
  -F "unitId=60d5ec49c1234567890abcdf" \
  -F "documentType=LEASE_AGREEMENT" \
  -F "documentName=Unit 101 Lease" \
  -F "description=12-month lease" \
  -F "expiryDate=2025-12-31" \
  -F "tags=lease,unit101,2024" \
  -F "document=@/path/to/lease.pdf"
```

### Upload Document (JavaScript/Node.js)

```javascript
const FormData = require("form-data");
const fs = require("fs");
const axios = require("axios");

const formData = new FormData();
formData.append("propertyId", "60d5ec49c1234567890abcde");
formData.append("unitId", "60d5ec49c1234567890abcdf");
formData.append("documentType", "LEASE_AGREEMENT");
formData.append("documentName", "Unit 101 Lease");
formData.append("document", fs.createReadStream("/path/to/lease.pdf"));

const response = await axios.post(
  "http://localhost:3000/api/v1/documents/upload",
  formData,
  {
    headers: {
      ...formData.getHeaders(),
      Authorization: `Bearer ${token}`,
    },
  },
);
```

### Get Unit Documents

```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3000/api/v1/documents/unit/60d5ec49c1234567890abcdf?documentType=LEASE_AGREEMENT"
```

### Get Expiring Documents

```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3000/api/v1/documents/expiring/list?daysFromNow=60"
```

## Future Enhancements

- [ ] Cloud storage integration (AWS S3, Google Cloud Storage)
- [ ] Document encryption at rest
- [ ] OCR for automated document classification
- [ ] Document versioning and history
- [ ] Bulk upload support
- [ ] Document sharing with tenants
- [ ] Email notifications for expiring documents
- [ ] Document templates for common agreements
- [ ] Digital signature integration
- [ ] Audit logging for document access

## Testing

Test files for this feature are located in:

- `tests/integration/document.integration.test.js` - Integration tests
- `tests/unit/modules/document.service.test.js` - Service layer tests

Run tests:

```bash
npm test -- document
npm run test:integration -- document
```

## Related Issues

- **Issue #6** - Unit document upload & access feature
- **Issue #7** - Docker containerization (separate)
