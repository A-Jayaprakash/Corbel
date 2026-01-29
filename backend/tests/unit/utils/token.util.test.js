import * as tokenUtil from "../../../src/utils/token.util.js";

describe("Token Utility - Unit Tests", () => {
  describe("generateAccessToken", () => {
    it("should generate a valid JWT token", () => {
      const payload = {
        owner_id: "507f1f77bcf86cd799439011",
        email: "john@example.com",
      };

      const token = tokenUtil.generateAccessToken(payload);

      expect(token).toBeTruthy();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3); // JWT structure: header.payload.signature
    });

    it("should include payload in token", () => {
      const payload = {
        owner_id: "507f1f77bcf86cd799439011",
        email: "john@example.com",
      };

      const token = tokenUtil.generateAccessToken(payload);

      // Decode the payload (without verification for test purposes)
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedPayload = JSON.parse(
        Buffer.from(base64, "base64").toString(),
      );

      expect(decodedPayload.owner_id).toBe(payload.owner_id);
      expect(decodedPayload.email).toBe(payload.email);
    });

    it("should generate different tokens for same payload", async () => {
      const payload = {
        owner_id: "507f1f77bcf86cd799439011",
        email: "john@example.com",
      };

      const token1 = tokenUtil.generateAccessToken(payload);
      // Add delay to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 1100));
      const token2 = tokenUtil.generateAccessToken(payload);

      // Tokens will be different due to timestamp (iat claim)
      expect(token1).not.toBe(token2);
    });
  });
});
