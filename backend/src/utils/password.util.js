import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

/**
 *
 * @param {string} password
 * @returns {Promise<string>} hashed password
 */

export const hashPassword = async (password) => {
  if (!password) {
    throw new Error("Password is required");
  }
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 *
 * @param {string} password
 * @param {string} hashpassword
 * @returns {Promise<boolean>}
 */

export const comparePassword = async (password, hashpassword) => {
  if (!password || !hashpassword) {
    throw new Error(
      "Both password and hashpassword are required for comparison",
    );
  }
  return bcrypt.compare(password, hashpassword);
};
