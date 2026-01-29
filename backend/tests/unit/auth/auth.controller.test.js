import {
  registerOwnerController,
  loginOwnerController,
} from "../../../src/modules/auth/auth.controller.js";
import {
  createMockRequest,
  createMockResponse,
  createMockNext,
} from "../../utils/test-helpers.js";

describe.skip("Auth Controller - Unit Tests", () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    mockNext = createMockNext();
    jest.clearAllMocks();
  });

  describe("registerOwnerController", () => {
    it("should register owner successfully with valid data", async () => {
      const ownerData = {
        name: "John Doe",
        email: "john@example.com",
        password: "SecurePass123",
        mobileNumber: "+1234567890",
      };

      mockReq.body = ownerData;
      authService.registerOwner.mockResolvedValueOnce({
        id: "507f1f77bcf86cd799439011",
        email: ownerData.email,
      });

      await registerOwnerController(mockReq, mockRes, mockNext);

      expect(authService.registerOwner).toHaveBeenCalledWith({
        name: ownerData.name,
        email: ownerData.email,
        password: ownerData.password,
        mobileNumber: ownerData.mobileNumber,
      });

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Owner registered successfully",
        data: {
          id: "507f1f77bcf86cd799439011",
          email: ownerData.email,
        },
      });
    });

    it("should handle registration error when email already exists", async () => {
      const ownerData = {
        name: "John Doe",
        email: "existing@example.com",
        password: "SecurePass123",
        mobileNumber: "+1234567890",
      };

      mockReq.body = ownerData;
      const error = new Error("Email already exists");
      authService.registerOwner.mockRejectedValueOnce(error);

      await registerOwnerController(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it("should handle validation errors gracefully", async () => {
      mockReq.body = {
        name: "",
        email: "invalid",
        password: "",
      };

      const error = new Error("Validation failed");
      authService.registerOwner.mockRejectedValueOnce(error);

      await registerOwnerController(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("loginOwnerController", () => {
    it("should login owner successfully with valid credentials", async () => {
      const credentials = {
        email: "john@example.com",
        password: "SecurePass123",
      };

      mockReq.body = credentials;
      authService.loginOwner.mockResolvedValueOnce({
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        expiresIn: 3600,
      });

      await loginOwnerController(mockReq, mockRes, mockNext);

      expect(authService.loginOwner).toHaveBeenCalledWith(credentials);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        token_type: "Bearer",
        expires_in: 3600,
      });
    });

    it("should return 401 when credentials are invalid", async () => {
      const credentials = {
        email: "john@example.com",
        password: "WrongPassword",
      };

      mockReq.body = credentials;
      const error = {
        statusCode: 401,
        message: "Invalid Credentials",
      };
      authService.loginOwner.mockRejectedValueOnce(error);

      await loginOwnerController(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it("should handle database errors during login", async () => {
      const credentials = {
        email: "john@example.com",
        password: "SecurePass123",
      };

      mockReq.body = credentials;
      const dbError = new Error("Database connection failed");
      authService.loginOwner.mockRejectedValueOnce(dbError);

      await loginOwnerController(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(dbError);
    });
  });
});
