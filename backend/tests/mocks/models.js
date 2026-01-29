/**
 * Mock Mongoose model methods
 */
export const createMockOwnerModel = () => ({
  findOne: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
  select: jest.fn(),
});

export const createMockPropertyModel = () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
});

export const createMockUnitModel = () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
});

export const createMockTenantModel = () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
});

export const createMockPaymentModel = () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
});

export const createMockRentBillModel = () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
});

/**
 * Setup chainable mock for Mongoose queries
 */
export const setupChainableMock = (mock, returnValue = {}) => {
  mock.mockReturnValue({
    select: jest.fn().mockResolvedValue(returnValue),
    lean: jest.fn().mockResolvedValue(returnValue),
    populate: jest.fn().mockResolvedValue(returnValue),
  });
  return mock;
};
