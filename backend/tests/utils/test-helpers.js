import mongoose from "mongoose";

/**
 * Generate mock MongoDB ObjectId
 */
export const generateMockId = () => new mongoose.Types.ObjectId();

/**
 * Create mock request object
 */
export const createMockRequest = (overrides = {}) => ({
  body: {},
  params: {},
  query: {},
  headers: {},
  owner: { id: generateMockId().toString() },
  ...overrides,
});

/**
 * Create mock response object
 */
export const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

/**
 * Create mock next function
 */
export const createMockNext = () => jest.fn();

/**
 * Helper to verify response
 */
export const verifyResponse = (res, statusCode, hasData = true) => {
  expect(res.status).toHaveBeenCalledWith(statusCode);
  expect(res.json).toHaveBeenCalled();

  if (hasData) {
    const callArg = res.json.mock.calls[0][0];
    return callArg;
  }
};

/**
 * Create standard test fixtures
 */
export const createTestFixtures = () => ({
  ownerId: generateMockId(),
  propertyId: generateMockId(),
  unitId: generateMockId(),
  tenantId: generateMockId(),
});
