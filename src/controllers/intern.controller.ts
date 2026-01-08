import { Request, Response } from "express";
import { Intern } from "../models/intern.model";
import { sendResponse } from "../utils/response";
import { uploadToPHPServer } from "../utils/phpUploader";

// ✅ Register intern (SIWES or Regular)
export const registerIntern = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, school, category, course } = req.body;

    if (!name || !phone || !email || !school || !category || !course) {
      return sendResponse(res, 400, false, "All fields are required");
    }

    const existing = await Intern.findOne({ phone });
    if (existing) {
      return sendResponse(res, 400, false, "Phone number already registered");
    }

    let siwesFormUrl: string | undefined;
    let paymentProofUrl: string | undefined;

    const files = req.files as {
      siwesForm?: Express.Multer.File[];
      paymentProof?: Express.Multer.File[];
    };

    if (files?.siwesForm?.[0]) {
      siwesFormUrl = await uploadToPHPServer(files.siwesForm[0]);
    }

    if (files?.paymentProof?.[0]) {
      paymentProofUrl = await uploadToPHPServer(files.paymentProof[0]);
    }

    const intern = new Intern({
      name,
      phone,
      email,
      school,
      category,
      course,
      siwesForm: siwesFormUrl,
      paymentProof: paymentProofUrl,
    });

    await intern.save();

    return sendResponse(
      res,
      201,
      true,
      "Intern registered successfully",
      intern
    );
  } catch (err: any) {
    return sendResponse(res, 500, false, err.message);
  }
};

// ✅ Mark attendance
export const markAttendance = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    const intern = await Intern.findOne({ phone });
    if (!intern) {
      return sendResponse(res, 404, false, "Intern not found");
    }

    return sendResponse(res, 200, true, "Attendance marked", {
      name: intern.name,
    });
  } catch (err: any) {
    return sendResponse(res, 500, false, err.message);
  }
};

// ✅ Get intern details
export const getInternDetails = async (req: Request, res: Response) => {
  try {
    const { phone } = req.params;
    const intern = await Intern.findOne({ phone });
    if (!intern) {
      return sendResponse(res, 404, false, "Intern not found");
    }

    return sendResponse(res, 200, true, "Intern details fetched", intern);
  } catch (err: any) {
    return sendResponse(res, 500, false, err.message);
  }
};
