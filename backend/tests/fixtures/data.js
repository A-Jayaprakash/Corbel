/**
 * Mock Owner data fixtures
 */
export const mockOwners = {
  owner1: {
    _id: "507f1f77bcf86cd799439011",
    name: "John Doe",
    email: "john@example.com",
    mobileNumber: "+1234567890",
    createdAt: new Date("2024-01-01"),
  },
  owner2: {
    _id: "507f1f77bcf86cd799439012",
    name: "Jane Smith",
    email: "jane@example.com",
    mobileNumber: "+0987654321",
    createdAt: new Date("2024-01-02"),
  },
};

/**
 * Mock Property data fixtures
 */
export const mockProperties = {
  property1: {
    _id: "607f1f77bcf86cd799439011",
    ownerId: "507f1f77bcf86cd799439011",
    name: "Downtown Apartment Building",
    address: "123 Main St, New York, NY",
    createdAt: new Date("2024-01-05"),
  },
  property2: {
    _id: "607f1f77bcf86cd799439012",
    ownerId: "507f1f77bcf86cd799439011",
    name: "Suburban House",
    address: "456 Oak Ave, LA, CA",
    createdAt: new Date("2024-01-06"),
  },
};

/**
 * Mock Unit data fixtures
 */
export const mockUnits = {
  unit1: {
    _id: "707f1f77bcf86cd799439011",
    propertyId: "607f1f77bcf86cd799439011",
    unitNumber: "101",
    rentAmount: 1500,
    bedrooms: 2,
    bathrooms: 1,
    createdAt: new Date("2024-01-10"),
  },
  unit2: {
    _id: "707f1f77bcf86cd799439012",
    propertyId: "607f1f77bcf86cd799439011",
    unitNumber: "102",
    rentAmount: 1600,
    bedrooms: 2,
    bathrooms: 2,
    createdAt: new Date("2024-01-11"),
  },
};

/**
 * Mock Tenant data fixtures
 */
export const mockTenants = {
  tenant1: {
    _id: "807f1f77bcf86cd799439011",
    unitId: "707f1f77bcf86cd799439011",
    name: "Alice Johnson",
    email: "alice@example.com",
    mobileNumber: "+1122334455",
    leaseStartDate: new Date("2024-01-15"),
    leaseEndDate: new Date("2025-01-15"),
    status: "active",
    createdAt: new Date("2024-01-15"),
  },
  tenant2: {
    _id: "807f1f77bcf86cd799439012",
    unitId: "707f1f77bcf86cd799439012",
    name: "Bob Williams",
    email: "bob@example.com",
    mobileNumber: "+5566778899",
    leaseStartDate: new Date("2024-02-01"),
    leaseEndDate: new Date("2025-02-01"),
    status: "active",
    createdAt: new Date("2024-02-01"),
  },
};

/**
 * Mock Payment data fixtures
 */
export const mockPayments = {
  payment1: {
    _id: "907f1f77bcf86cd799439011",
    rentBillId: "a07f1f77bcf86cd799439011",
    tenantId: "807f1f77bcf86cd799439011",
    amount: 1500,
    paymentDate: new Date("2024-02-05"),
    paymentMethod: "bank_transfer",
    status: "completed",
    transactionId: "TXN001",
    createdAt: new Date("2024-02-05"),
  },
  payment2: {
    _id: "907f1f77bcf86cd799439012",
    rentBillId: "a07f1f77bcf86cd799439012",
    tenantId: "807f1f77bcf86cd799439012",
    amount: 1600,
    paymentDate: new Date("2024-02-08"),
    paymentMethod: "cheque",
    status: "pending",
    createdAt: new Date("2024-02-08"),
  },
};

/**
 * Mock Rent Bill data fixtures
 */
export const mockRentBills = {
  bill1: {
    _id: "a07f1f77bcf86cd799439011",
    unitId: "707f1f77bcf86cd799439011",
    tenantId: "807f1f77bcf86cd799439011",
    ownerId: "507f1f77bcf86cd799439011",
    amount: 1500,
    dueDate: new Date("2024-02-05"),
    issuedDate: new Date("2024-01-25"),
    status: "paid",
    month: "January",
    year: 2024,
    createdAt: new Date("2024-01-25"),
  },
  bill2: {
    _id: "a07f1f77bcf86cd799439012",
    unitId: "707f1f77bcf86cd799439012",
    tenantId: "807f1f77bcf86cd799439012",
    ownerId: "507f1f77bcf86cd799439011",
    amount: 1600,
    dueDate: new Date("2024-03-05"),
    issuedDate: new Date("2024-02-20"),
    status: "pending",
    month: "February",
    year: 2024,
    createdAt: new Date("2024-02-20"),
  },
};
