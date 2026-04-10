import jwt from "jsonwebtoken";

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return secret;
};

const getRefreshSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + "_refresh";
};

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, getSecret(), { expiresIn: "1h" });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, getSecret());
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, getRefreshSecret(), { expiresIn: "7d" });
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, getRefreshSecret());
};
