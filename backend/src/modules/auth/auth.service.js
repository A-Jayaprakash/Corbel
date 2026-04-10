import { Owner } from "../../models/Owner.model.js";
import { hashPassword, comparePassword } from "../../utils/password.util.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/token.util.js";

/**
 * Register a new property owner
 * @param {Object} payload
 * @returns {Object} { id, email }
 */
export const registerOwner = async ({
  name,
  email,
  password,
  mobileNumber,
}) => {
  const normalizedEmail = email.toLowerCase();

  const existingOwner = await Owner.findOne({ email: normalizedEmail });
  if (existingOwner) {
    throw {
      statusCode: 409,
      message: "Email already exists",
    };
  }

  const passwordHash = await hashPassword(password);

  const owner = await Owner.create({
    name,
    email: normalizedEmail,
    mobileNumber,
    passwordHash,
  });

  return {
    id: owner._id,
    email: owner.email,
  };
};

/**
 * Login an owner and return a JWT
 * @param {Object} param0
 * @returns {Object} { accessToken, expiresIn }
 */
export const loginOwner = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase();
  const owner = await Owner.findOne({ email: normalizedEmail }).select(
    "+passwordHash",
  );

  if (!owner) {
    throw {
      statusCode: 401,
      message: "Invalid Credentials",
    };
  }

  const isPasswordValid = await comparePassword(password, owner.passwordHash);

  if (!isPasswordValid) {
    throw {
      statusCode: 401,
      message: "Invalid Credentials",
    };
  }

  const payload = { owner_id: owner._id, email: owner.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    expiresIn: 3600,
  };
};

export const refreshAccessToken = async ({ refreshToken }) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw { statusCode: 401, message: "INVALID_REFRESH_TOKEN" };
  }

  const owner = await Owner.findById(decoded.owner_id);
  if (!owner) throw { statusCode: 401, message: "INVALID_REFRESH_TOKEN" };

  const accessToken = generateAccessToken({
    owner_id: owner._id,
    email: owner.email,
  });

  return { accessToken, expiresIn: 3600 };
};
