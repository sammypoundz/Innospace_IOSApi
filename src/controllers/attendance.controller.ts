import { Request, Response } from "express";
import { Intern } from "../models/intern.model";
import { User } from "../models/user.model";
import { Attendance } from "../models/attendance.model";
import { sendResponse } from "../utils/response";

/* ===========================
 ✅ MARK ATTENDANCE (ID CARD / QR)
=========================== */
export const markAttendance = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;

    if (!studentId) {
      return sendResponse(res, 400, false, "Student ID is required");
    }

    let userType: "Intern" | "Staff" = "Intern";
    let userId;
    let name = "";
    let phone = "";

    /* =====================
       🔍 CHECK INTERN FIRST
    ===================== */
    const intern = await Intern.findOne({ studentId });

    if (intern) {
      userType = "Intern";
      userId = intern._id;
      name = intern.name;
      phone = intern.phone;
    } else {
      /* =====================
         🔍 CHECK STAFF (OPTIONAL)
      ===================== */
      const staff = await User.findOne({ staffId: studentId });

      if (!staff) {
        return sendResponse(res, 404, false, "Invalid Student ID");
      }

      userType = "Staff";
      userId = staff._id;
      name = staff.fullname;
      phone = staff.phone;
    }

    /* =====================
       📅 PREVENT DOUBLE CHECK-IN
    ===================== */
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alreadyCheckedIn = await Attendance.findOne({
      studentId,
      date: { $gte: today },
    });

    if (alreadyCheckedIn) {
      return sendResponse(res, 409, false, "Attendance already marked for today");
    }

    /* =====================
       ⏰ SAVE ATTENDANCE
    ===================== */
    const now = new Date();

    const attendance = await Attendance.create({
      userType,
      userId,
      studentId,
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

/* ===========================
 ✅ ATTENDANCE SUMMARY (ADMIN)
=========================== */
export const getAttendanceSummary = async (req: Request, res: Response) => {
  try {
    const { period } = req.query; // day | month | all

    const now = new Date();
    let startDate = new Date(0);

    if (period === "day") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const records = await Attendance.find({
      date: { $gte: startDate },
    }).sort({ createdAt: -1 });

    const total = records.length;
    const interns = records.filter(r => r.userType === "Intern").length;
    const staff = records.filter(r => r.userType === "Staff").length;

    return sendResponse(res, 200, true, "Attendance summary fetched", {
      period: period || "all",
      summary: {
        total,
        interns,
        staff,
      },
      records,
    });
  } catch (err: any) {
    return sendResponse(res, 500, false, err.message);
  }
};
