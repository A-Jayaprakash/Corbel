import {
  jest,
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
} from "@jest/globals";

jest.unstable_mockModule("../../../src/models/Owner.model.js", () => ({
  Owner: { findOne: jest.fn(), create: jest.fn() },
}));
jest.unstable_mockModule("../../../src/utils/password.util.js", () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
}));
jest.unstable_mockModule("../../../src/utils/token.util.js", () => ({
  generateAccessToken: jest.fn(),
}));

let registerOwner,
  loginOwner,
  Owner,
  hashPassword,
  comparePassword,
  generateAccessToken;

beforeAll(async () => {
  ({ registerOwner, loginOwner } =
    await import("../../../src/modules/auth/auth.service.js"));
  ({ Owner } = await import("../../../src/models/Owner.model.js"));
  ({ hashPassword, comparePassword } =
    await import("../../../src/utils/password.util.js"));
  ({ generateAccessToken } = await import("../../../src/utils/token.util.js"));
});

beforeEach(() => jest.clearAllMocks());

describe("Auth Service", () => {
  describe("registerOwner", () => {
    it("should register a new owner and return id + email", async () => {
      Owner.findOne.mockResolvedValueOnce(null);
      hashPassword.mockResolvedValueOnce("$2b$12$hashed");
      Owner.create.mockResolvedValueOnce({
        _id: "id1",
        email: "john@example.com",
      });

      const result = await registerOwner({
        name: "John",
        email: "JOHN@EXAMPLE.COM",
        password: "SecurePass1",
        mobileNumber: "+91999",
      });

      expect(Owner.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
      expect(hashPassword).toHaveBeenCalledWith("SecurePass1");
      expect(result).toEqual({ id: "id1", email: "john@example.com" });
    });

    it("should throw 409 when email already exists", async () => {
      Owner.findOne.mockResolvedValueOnce({ _id: "existing" });

      await expect(
        registerOwner({
          name: "J",
          email: "john@example.com",
          password: "p",
          mobileNumber: "1",
        }),
      ).rejects.toEqual({ statusCode: 409, message: "Email already exists" });

      expect(hashPassword).not.toHaveBeenCalled();
    });
  });

  describe("loginOwner", () => {
    it("should return accessToken and expiresIn on valid credentials", async () => {
      const mockOwner = {
        _id: "id1",
        email: "john@example.com",
        passwordHash: "$2b$hashed",
      };
      Owner.findOne.mockReturnValueOnce({
        select: jest.fn().mockResolvedValueOnce(mockOwner),
      });
      comparePassword.mockResolvedValueOnce(true);
      generateAccessToken.mockReturnValueOnce("jwt.token.here");

      const result = await loginOwner({
        email: "john@example.com",
        password: "SecurePass1",
      });

      expect(comparePassword).toHaveBeenCalledWith(
        "SecurePass1",
        mockOwner.passwordHash,
      );
      expect(generateAccessToken).toHaveBeenCalledWith({
        owner_id: "id1",
        email: "john@example.com",
      });
      expect(result).toEqual({
        accessToken: "jwt.token.here",
        expiresIn: 3600,
      });
    });

    it("should throw 401 when owner not found", async () => {
      Owner.findOne.mockReturnValueOnce({
        select: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(
        loginOwner({ email: "x@x.com", password: "p" }),
      ).rejects.toEqual({
        statusCode: 401,
        message: "Invalid Credentials",
      });
    });

    it("should throw 401 when password is wrong", async () => {
      Owner.findOne.mockReturnValueOnce({
        select: jest
          .fn()
          .mockResolvedValueOnce({
            _id: "id1",
            email: "x@x.com",
            passwordHash: "h",
          }),
      });
      comparePassword.mockResolvedValueOnce(false);

      await expect(
        loginOwner({ email: "x@x.com", password: "wrong" }),
      ).rejects.toEqual({
        statusCode: 401,
        message: "Invalid Credentials",
      });
    });
  });
});
