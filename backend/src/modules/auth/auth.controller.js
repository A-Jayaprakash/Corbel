import {
  registerOwner,
  loginOwner,
  refreshAccessToken,
  setTenantPassword,
} from "./auth.service.js";

export const registerOwnerController = async (req, res, next) => {
  try {
    const { name, email, password, mobileNumber } = req.body;
    const result = await registerOwner({ name, email, password, mobileNumber });
    return res
      .status(201)
      .json({ message: "Owner registered successfully", data: result });
  } catch (error) {
    next(error);
  }
};

export const loginOwnerController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await loginOwner({ email, password });
    return res.status(200).json({
      access_token: result.accessToken,
      refresh_token: result.refreshToken,
      token_type: "Bearer",
      expires_in: result.expiresIn,
      role: result.role,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshTokenController = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    const result = await refreshAccessToken({ refreshToken: refresh_token });
    return res.status(200).json({
      access_token: result.accessToken,
      token_type: "Bearer",
      expires_in: result.expiresIn,
    });
  } catch (error) {
    next(error);
  }
};

export const setTenantPasswordController = async (req, res, next) => {
  try {
    const { password } = req.body;
    const result = await setTenantPassword({
      tenantId: req.params.tenantId,
      ownerId: req.user.id,
      password,
    });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
