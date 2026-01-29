import * as passwordUtil from "../../../src/utils/password.util.js";

describe("Password Utility - Unit Tests", () => {
  describe("hashPassword", () => {
    it("should hash a password securely", async () => {
      const password = "SecurePassword123";

      const hashedPassword = await passwordUtil.hashPassword(password);

      expect(hashedPassword).toBeTruthy();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(password.length);
    });

    it("should produce different hash for same password on multiple calls", async () => {
      const password = "SecurePassword123";

      const hash1 = await passwordUtil.hashPassword(password);
      const hash2 = await passwordUtil.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("comparePassword", () => {
    it("should return true for correct password", async () => {
      const password = "SecurePassword123";
      const hashedPassword = await passwordUtil.hashPassword(password);

      const isValid = await passwordUtil.comparePassword(
        password,
        hashedPassword,
      );

      expect(isValid).toBe(true);
    });

    it("should return false for incorrect password", async () => {
      const password = "SecurePassword123";
      const hashedPassword = await passwordUtil.hashPassword(password);

      const isValid = await passwordUtil.comparePassword(
        "WrongPassword",
        hashedPassword,
      );

      expect(isValid).toBe(false);
    });

    it("should throw error for empty password", async () => {
      const password = "SecurePassword123";
      const hashedPassword = await passwordUtil.hashPassword(password);

      await expect(
        passwordUtil.comparePassword("", hashedPassword),
      ).rejects.toThrow("Both password and hashpassword are required");
    });
  });
});
