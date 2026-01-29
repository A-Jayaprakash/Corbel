import jwt from "jsonwebtoken";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT is not defined in environment variables");
  }
  return secret;
}

export const generateAccessToken = (payload) => {
  const JWT_SECRET = getJwtSecret();
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyAccessToken = (token) => {
  const JWT_SECRET = getJwtSecret();
  return jwt.verify(token, JWT_SECRET);
};
