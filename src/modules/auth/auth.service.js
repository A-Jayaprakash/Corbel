import { Owner } from "../../models/Owner.model";
import {
  hashPassword,
  comparePassword,
  hashPassword,
} from "../../utils/password.util";
import { generateAccessToken } from "../../utils/token.util";

/**
 *
 * @param {Object} payload
 * @returns {Object}
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

  const hashPassword = await hashPassword(password);

  const owner = await Owner.create({
    name,
    email: normalizedEmail,
    mobileNumber,
    hashPassword,
  });

  return {
    id: owner._id,
    email: owner.email,
  };
};

/**
 *
 * @param {Object} param0
 * @returns {Object}
 */

export const loginOwner = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase();
  const owner = await Owner.findOne({ email: normalizedEmail }).select(
    "+hashPassword",
  );

  if (!owner) {
    throw {
      statusCode: 401,
      message: "Invalid Credentials",
    };
  }

  const isPasswordValid = await comparePassword(password, owner.hashPassword);

  if (!isPasswordValid) {
    throw {
      statusCode: 401,
      message: "Invalid Credentials",
    };
  }

  const accessToken = generateAccessToken({
    owner_id: owner._id,
    email: owner.email,
  });

  return {
    accessToken,
    expiresIn: 3600,
  };
};
