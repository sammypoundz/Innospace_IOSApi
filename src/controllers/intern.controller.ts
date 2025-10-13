import { Request, Response } from "express";
import { Intern } from "../models/intern.model";
import { sendResponse } from "../utils/response";

// Register intern
export const registerIntern = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, school, category } = req.body;
    const siwesForm = (req.files as any)?.siwesForm?.[0]?.path;
    const paymentProof = (req.files as any)?.paymentProof?.[0]?.path;

    const existing = await Intern.findOne({ phone });
    if (existing) return sendResponse(res, 400, false, "Phone number already registered");

    const intern = new Intern({
      name,
      phone,
      email,
      school,
      category,
      siwesForm,
      paymentProof,
    });

    await intern.save();
    return sendResponse(res, 201, true, "Intern registered successfully", intern);
  } catch (err: any) {
    return sendResponse(res, 500, false, err.message);
  }
};

// Attendance
export const markAttendance = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    const intern = await Intern.findOne({ phone });
    if (!intern) return sendResponse(res, 404, false, "Intern not found");

    return sendResponse(res, 200, true, "Attendance marked", { name: intern.name });
  } catch (err: any) {
    return sendResponse(res, 500, false, err.message);
  }
};

// Get intern details by phone
export const getInternDetails = async (req: Request, res: Response) => {
  try {
    const { phone } = req.params;
    const intern = await Intern.findOne({ phone });
    if (!intern) return sendResponse(res, 404, false, "Intern not found");

    return sendResponse(res, 200, true, "Intern details fetched", intern);
  } catch (err: any) {
    return sendResponse(res, 500, false, err.message);
  }
};
