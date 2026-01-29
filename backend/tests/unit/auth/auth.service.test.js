import * as authService from "../../../src/modules/auth/auth.service.js";
import * as passwordUtil from "../../../src/utils/password.util.js";
import * as tokenUtil from "../../../src/utils/token.util.js";

describe.skip("Auth Service - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerOwner", () => {
    it("should successfully register a new owner", async () => {
      const ownerData = {
        name: "John Doe",
        email: "john@example.com",
        password: "SecurePass123",
        mobileNumber: "+1234567890",
      };

      const hashedPassword = "$2b$10$hashedpasswordexample";
      const newOwner = {
        _id: "507f1f77bcf86cd799439011",
        name: ownerData.name,
        email: ownerData.email.toLowerCase(),
        mobileNumber: ownerData.mobileNumber,
      };

      Owner.findOne.mockResolvedValueOnce(null);
      passwordUtil.hashPassword.mockResolvedValueOnce(hashedPassword);
      Owner.create.mockResolvedValueOnce(newOwner);

      const result = await authService.registerOwner(ownerData);

      expect(Owner.findOne).toHaveBeenCalledWith({
        email: ownerData.email.toLowerCase(),
      });
      expect(passwordUtil.hashPassword).toHaveBeenCalledWith(
        ownerData.password,
      );
      expect(Owner.create).toHaveBeenCalled();
      expect(result).toEqual({
        id: newOwner._id,
        email: newOwner.email,
      });
    });

    it("should throw error when email already exists", async () => {
      const ownerData = {
        name: "John Doe",
        email: "existing@example.com",
        password: "SecurePass123",
        mobileNumber: "+1234567890",
      };

      const existingOwner = {
        _id: "507f1f77bcf86cd799439010",
        email: "existing@example.com",
      };
      Owner.findOne.mockResolvedValueOnce(existingOwner);

      await expect(authService.registerOwner(ownerData)).rejects.toEqual({
        statusCode: 409,
        message: "Email already exists",
      });

      expect(passwordUtil.hashPassword).not.toHaveBeenCalled();
    });

    it("should normalize email to lowercase during registration", async () => {
      const ownerData = {
        name: "John Doe",
        email: "JOHN@EXAMPLE.COM",
        password: "SecurePass123",
        mobileNumber: "+1234567890",
      };

      Owner.findOne.mockResolvedValueOnce(null);
      passwordUtil.hashPassword.mockResolvedValueOnce("$2b$10$hashedpassword");
      Owner.create.mockResolvedValueOnce({
        _id: "507f1f77bcf86cd799439011",
        email: "john@example.com",
      });

      await authService.registerOwner(ownerData);

      expect(Owner.findOne).toHaveBeenCalledWith({
        email: "john@example.com",
      });
    });
  });

  describe("loginOwner", () => {
    it("should successfully login owner with correct credentials", async () => {
      const credentials = {
        email: "john@example.com",
        password: "SecurePass123",
      };

      const owner = {
        _id: "507f1f77bcf86cd799439011",
        email: credentials.email,
        hashPassword: "$2b$10$hashedpassword",
      };

      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

      Owner.findOne.mockReturnValueOnce({
        select: jest.fn().mockResolvedValueOnce(owner),
      });
      passwordUtil.comparePassword.mockResolvedValueOnce(true);
      tokenUtil.generateAccessToken.mockReturnValueOnce(token);

      const result = await authService.loginOwner(credentials);

      expect(Owner.findOne).toHaveBeenCalledWith({
        email: credentials.email.toLowerCase(),
      });
      expect(passwordUtil.comparePassword).toHaveBeenCalledWith(
        credentials.password,
        owner.hashPassword,
      );
      expect(tokenUtil.generateAccessToken).toHaveBeenCalledWith({
        owner_id: owner._id,
        email: owner.email,
      });
      expect(result).toEqual({
        accessToken: token,
        expiresIn: 3600,
      });
    });

    it("should throw error when owner email not found", async () => {
      const credentials = {
        email: "nonexistent@example.com",
        password: "SecurePass123",
      };

      Owner.findOne.mockReturnValueOnce({
        select: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(authService.loginOwner(credentials)).rejects.toEqual({
        statusCode: 401,
        message: "Invalid Credentials",
      });

      expect(passwordUtil.comparePassword).not.toHaveBeenCalled();
    });

    it("should throw error when password is incorrect", async () => {
      const credentials = {
        email: "john@example.com",
        password: "WrongPassword",
      };

      const owner = {
        _id: "507f1f77bcf86cd799439011",
        email: credentials.email,
        hashPassword: "$2b$10$hashedpassword",
      };

      Owner.findOne.mockReturnValueOnce({
        select: jest.fn().mockResolvedValueOnce(owner),
      });
      passwordUtil.comparePassword.mockResolvedValueOnce(false);

      await expect(authService.loginOwner(credentials)).rejects.toEqual({
        statusCode: 401,
        message: "Invalid Credentials",
      });

      expect(tokenUtil.generateAccessToken).not.toHaveBeenCalled();
    });

    it("should normalize email to lowercase during login", async () => {
      const credentials = {
        email: "JOHN@EXAMPLE.COM",
        password: "SecurePass123",
      };

      Owner.findOne.mockReturnValueOnce({
        select: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(authService.loginOwner(credentials)).rejects.toEqual({
        statusCode: 401,
        message: "Invalid Credentials",
      });

      expect(Owner.findOne).toHaveBeenCalledWith({
        email: "john@example.com",
      });
    });
  });
});
