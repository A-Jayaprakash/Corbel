import { registerOwner, loginOwner } from "../auth/auth.service";

export const registerOwnerController = async (req, res, next) => {
  try {
    const { name, email, password, mobileNumber } = req.body;

    const result = await registerOwner({
      name,
      email,
      password,
      mobileNumber,
    });

    return res.status(201).json({
      message: "Owner registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const loginOwnerController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await loginOwner({
      email,
      password,
    });

    return res.status(200).json({
      access_token: result.access_token,
      token_type: "Bearer",
      expires_in: result.expires_in,
    });
  } catch (error) {
    next(error);
  }
};
