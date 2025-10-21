import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import { generateToken } from "../utils/jwt";
import { sendResponse } from "../utils/response";

// ✅ Register new user (staff or admin)
export const register = async (req: Request, res: Response) => {
  try {
    const { fullname, email, phone, password, role } = req.body;

    if (!fullname || !email || !phone || !password) {
      return sendResponse(res, 400, false, "All fields are required");
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return sendResponse(res, 400, false, "Email already exists");
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return sendResponse(res, 400, false, "Phone number already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullname,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    await user.save();

    return sendResponse(res, 201, true, "User registered successfully", {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch (err: any) {
    return sendResponse(res, 500, false, err.message);
  }
};

// ✅ Login user (with email or phone)
export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return sendResponse(res, 400, false, "Email/Phone and password are required");
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return sendResponse(res, 400, false, "Invalid credentials");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return sendResponse(res, 400, false, "Invalid credentials");
    }

    // ✅ Include phone in the token
    const token = generateToken({
      id: user._id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    return sendResponse(res, 200, true, "Login successful", {
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err: any) {
    return sendResponse(res, 500, false, err.message);
  }
};
