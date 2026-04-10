import {
  jest,
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
} from "@jest/globals";

jest.unstable_mockModule("../../../src/modules/auth/auth.service.js", () => ({
  registerOwner: jest.fn(),
  loginOwner: jest.fn(),
  refreshAccessToken: jest.fn(),
}));

let registerOwnerController, loginOwnerController, registerOwner, loginOwner;

beforeAll(async () => {
  ({ registerOwnerController, loginOwnerController } =
    await import("../../../src/modules/auth/auth.controller.js"));
  ({ registerOwner, loginOwner } =
    await import("../../../src/modules/auth/auth.service.js"));
});

beforeEach(() => jest.clearAllMocks());

const mockRes = () => {
  const r = {};
  r.status = jest.fn().mockReturnValue(r);
  r.json = jest.fn().mockReturnValue(r);
  return r;
};

describe("Auth Controller", () => {
  describe("registerOwnerController", () => {
    it("should return 201 with message and data on success", async () => {
      const req = {
        body: { name: "J", email: "j@j.com", password: "p", mobileNumber: "1" },
      };
      const res = mockRes();
      const next = jest.fn();
      registerOwner.mockResolvedValueOnce({ id: "id1", email: "j@j.com" });

      await registerOwnerController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Owner registered successfully",
        data: { id: "id1", email: "j@j.com" },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with error on failure", async () => {
      const req = { body: {} };
      const res = mockRes();
      const next = jest.fn();
      const err = { statusCode: 409, message: "Email already exists" };
      registerOwner.mockRejectedValueOnce(err);

      await registerOwnerController(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("loginOwnerController", () => {
    it("should return 200 with token on valid credentials", async () => {
      const req = { body: { email: "j@j.com", password: "p" } };
      const res = mockRes();
      const next = jest.fn();
      loginOwner.mockResolvedValueOnce({ accessToken: "tok", expiresIn: 3600 });

      await loginOwnerController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        access_token: "tok",
        token_type: "Bearer",
        expires_in: 3600,
      });
    });

    it("should call next on login failure", async () => {
      const req = { body: { email: "j@j.com", password: "wrong" } };
      const res = mockRes();
      const next = jest.fn();
      loginOwner.mockRejectedValueOnce({
        statusCode: 401,
        message: "Invalid Credentials",
      });

      await loginOwnerController(req, res, next);

      expect(next).toHaveBeenCalledWith({
        statusCode: 401,
        message: "Invalid Credentials",
      });
    });
  });
});
