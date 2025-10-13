import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import { generateToken } from "../utils/jwt";
import { sendResponse } from "../utils/response";

export const register = async (req: Request, res: Response) => {
  try {
    const { fullname, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return sendResponse(res, 400, false, "Email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ fullname, email, password: hashedPassword, role });
    await user.save();

    return sendResponse(res, 201, true, "User registered successfully", {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
    });
  } catch (err: any) {
    return sendResponse(res, 500, false, err.message);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return sendResponse(res, 400, false, "Invalid credentials");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return sendResponse(res, 400, false, "Invalid credentials");

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return sendResponse(res, 200, true, "Login successful", {
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    return sendResponse(res, 500, false, err.message);
  }
};
