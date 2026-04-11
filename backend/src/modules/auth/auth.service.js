import { Owner } from "../../models/Owner.model.js";
import { Tenant } from "../../models/Tenant.model.js";
import { hashPassword, comparePassword } from "../../utils/password.util.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/token.util.js";

export const registerOwner = async ({
  name,
  email,
  password,
  mobileNumber,
}) => {
  const normalizedEmail = email.toLowerCase();
  if (await Owner.findOne({ email: normalizedEmail })) {
    throw { statusCode: 409, message: "Email already exists" };
  }
  const passwordHash = await hashPassword(password);
  const owner = await Owner.create({
    name,
    email: normalizedEmail,
    mobileNumber,
    passwordHash,
  });
  return { id: owner._id, email: owner.email };
};

export const loginOwner = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase();

  // Check Owner/Admin first
  const owner = await Owner.findOne({ email: normalizedEmail }).select(
    "+passwordHash",
  );
  if (owner) {
    if (!(await comparePassword(password, owner.passwordHash))) {
      throw { statusCode: 401, message: "Invalid Credentials" };
    }
    const payload = {
      user_id: owner._id,
      email: owner.email,
      role: owner.role,
    };
    return {
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload),
      expiresIn: 3600,
      role: owner.role,
    };
  }

  // Check Tenant
  const tenant = await Tenant.findOne({
    email: normalizedEmail,
    status: "ACTIVE",
  }).select("+passwordHash");
  if (!tenant || !tenant.passwordHash) {
    throw { statusCode: 401, message: "Invalid Credentials" };
  }
  if (!(await comparePassword(password, tenant.passwordHash))) {
    throw { statusCode: 401, message: "Invalid Credentials" };
  }
  const payload = {
    user_id: tenant._id,
    email: tenant.email,
    role: "tenant",
    unitId: tenant.unitId,
    propertyId: tenant.propertyId,
    ownerId: tenant.ownerId,
  };
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
    expiresIn: 3600,
    role: "tenant",
  };
};

export const refreshAccessToken = async ({ refreshToken }) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw { statusCode: 401, message: "INVALID_REFRESH_TOKEN" };
  }

  // Verify subject still exists
  if (decoded.role === "tenant") {
    const tenant = await Tenant.findById(decoded.user_id);
    if (!tenant) throw { statusCode: 401, message: "INVALID_REFRESH_TOKEN" };
  } else {
    const owner = await Owner.findById(decoded.user_id);
    if (!owner) throw { statusCode: 401, message: "INVALID_REFRESH_TOKEN" };
  }

  const { iat, exp, ...payload } = decoded;
  void iat;
  void exp;
  return { accessToken: generateAccessToken(payload), expiresIn: 3600 };
};

// Called by owner when assigning/updating tenant — sets tenant's login password
export const setTenantPassword = async ({ tenantId, ownerId, password }) => {
  const tenant = await Tenant.findOne({ _id: tenantId, ownerId });
  if (!tenant) throw { statusCode: 404, message: "TENANT_NOT_FOUND" };
  tenant.passwordHash = await hashPassword(password);
  await tenant.save();
  return { success: true };
};
