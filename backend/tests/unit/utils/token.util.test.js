import * as tokenUtil from "../../../src/utils/token.util.js";

describe("Token Utility", () => {
  describe("generateAccessToken", () => {
    it("should generate a valid JWT token", () => {
      const payload = {
        owner_id: "507f1f77bcf86cd799439011",
        email: "john@example.com",
      };
      const token = tokenUtil.generateAccessToken(payload);
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3);
    });

    it("should include payload in token", () => {
      const payload = {
        owner_id: "507f1f77bcf86cd799439011",
        email: "john@example.com",
      };
      const token = tokenUtil.generateAccessToken(payload);
      const decoded = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString(),
      );
      expect(decoded.owner_id).toBe(payload.owner_id);
      expect(decoded.email).toBe(payload.email);
    });
  });

  describe("verifyAccessToken", () => {
    it("should verify a valid token", () => {
      const payload = {
        owner_id: "507f1f77bcf86cd799439011",
        email: "john@example.com",
      };
      const token = tokenUtil.generateAccessToken(payload);
      const decoded = tokenUtil.verifyAccessToken(token);
      expect(decoded.owner_id).toBe(payload.owner_id);
    });

    it("should throw on invalid token", () => {
      expect(() => tokenUtil.verifyAccessToken("bad.token.here")).toThrow();
    });
  });
});
