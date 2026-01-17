import { Request, Response } from "express";
import mongoose from "mongoose";
import { Intern, IIntern } from "../models/intern.model";
import { User, IUser } from "../models/user.model";
import { Attendance } from "../models/attendance.model";
import { sendResponse } from "../utils/response";

/* ===========================
 ✅ MARK ATTENDANCE (QR / ID CARD)
=========================== */
export const markAttendance = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;

    if (!studentId) {
      return sendResponse(res, 400, false, "Student ID is required");
    }

    // ✅ Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return sendResponse(res, 400, false, "Invalid Student ID format");
    }

    let user: IIntern | IUser | null = null;
    let userType: "Intern" | "Staff" = "Intern";
    let name = "";
    let phone = "";

    /* =====================
       🔍 CHECK INTERN FIRST
    ===================== */
    const intern = await Intern.findById(studentId);

    if (intern) {
      user = intern;
      userType = "Intern";
      name = intern.name;
      phone = intern.phone;
    } else {
      /* =====================
         🔍 CHECK STAFF
      ===================== */
      const staff = await User.findById(studentId);

      if (!staff) {
        return sendResponse(res, 404, false, "Invalid Student ID");
      }

      user = staff;
      userType = "Staff";
      name = staff.fullname;
      phone = staff.phone;
    }

    /* =====================
       📅 PREVENT DOUBLE CHECK-IN
    ===================== */
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const alreadyMarked = await Attendance.findOne({
      userId: user._id,
      date: { $gte: startOfToday },
    });

    if (alreadyMarked) {
      return sendResponse(res, 409, false, "Attendance already marked today");
    }

    /* =====================
       ⏰ SAVE ATTENDANCE
    ===================== */
    const now = new Date();

    const attendance = await Attendance.create({
      userType,
      userId: user._id,      // Intern/Staff reference
      studentId: user._id.toString(), // QR-scanned ID
      name,
      phone,
      date: now,
      time: now.toLocaleTimeString("en-NG"),
    });

    return sendResponse(
      res,
      201,
      true,
      "Attendance marked successfully",
      attendance
    );
  } catch (err: any) {
    return sendResponse(res, 500, false, err.message);
  }
};
