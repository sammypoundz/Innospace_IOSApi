import { Request, Response } from "express";
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

    let user: IIntern | IUser | null = null;
    let userType: "Intern" | "Staff" = "Intern";
    let name = "";
    let phone = "";

    // 🔍 Check Intern first
    const intern = await Intern.findOne({ studentId });

    if (intern) {
      user = intern;
      userType = "Intern";
      name = intern.name;
      phone = intern.phone;
    } else {
      // 🔍 Check Staff (if you use staffId)
      const staff = await User.findOne({ staffId: studentId });

      if (!staff) {
        return sendResponse(res, 404, false, "Invalid Student ID");
      }

      user = staff;
      userType = "Staff";
      name = staff.fullname;
      phone = staff.phone;
    }

    // 📅 Prevent multiple attendance per day
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const alreadyMarked = await Attendance.findOne({
      userId: user._id,
      date: { $gte: startOfToday },
    });

    if (alreadyMarked) {
      return sendResponse(res, 409, false, "Attendance already marked today");
    }

    // ⏰ Time
    const now = new Date();

    const attendance = await Attendance.create({
      userType,
      userId: user._id,
      studentId,          // ✅ matches model
      name,
      phone,
      date: now,          // ✅ Date
      time: now.toLocaleTimeString("en-NG"), // ✅ required string
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
 ✅ ATTENDANCE SUMMARY
=========================== */
export const getAttendanceSummary = async (req: Request, res: Response) => {
  try {
    const { period } = req.query; // day | month

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
