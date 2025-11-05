import { Request, Response } from "express";
import { Intern, IIntern } from "../models/intern.model";
import { User, IUser } from "../models/user.model";
import { Attendance } from "../models/attendance.model";
import { sendResponse } from "../utils/response";

/* ===========================
 ✅ MARK ATTENDANCE
=========================== */
export const markAttendance = async (req: Request, res: Response) => {
  try {
    const { phone, latitude, longitude } = req.body;

    if (!phone || !latitude || !longitude)
      return sendResponse(res, 400, false, "Phone, latitude and longitude are required");

    // Find Intern or Staff
    let user: IIntern | IUser | null = await Intern.findOne({ phone });
    let userType: "Intern" | "Staff" = "Intern";
    let name = "";

    if (user) {
      name = (user as IIntern).name;
    } else {
      const staff = await User.findOne({
        $or: [{ phone }, { email: phone }, { fullname: phone }],
      });
      if (!staff) return sendResponse(res, 404, false, "User not found");

      user = staff;
      userType = "Staff";
      name = (staff as IUser).fullname;
    }

    // Hub coordinates (actual InnoSpaceX)
    const HUB_LAT = 11.998583;
    const HUB_LON = 8.559140;
    const MAX_DISTANCE_METERS = 1000;

    const distance = getDistanceFromLatLonInMeters(
      Number(latitude),
      Number(longitude),
      HUB_LAT,
      HUB_LON
    );

    if (distance > MAX_DISTANCE_METERS) {
      return sendResponse(
        res,
        403,
        false,
        `You are too far from the InnoSpaceX hub (${Math.round(distance)}m away)`
      );
    }

    // Record attendance
    const now = new Date();
    const attendance = await Attendance.create({
      userType,
      userId: user._id,
      name,
      phone,
      date: now,
      time: now.toLocaleTimeString(),
      location: { latitude, longitude },
    });

    return sendResponse(res, 200, true, "Attendance marked successfully", attendance);
  } catch (err: any) {
    return sendResponse(res, 500, false, err.message);
  }
};

/* ===========================
 ✅ ATTENDANCE SUMMARY
=========================== */
export const getAttendanceSummary = async (req: Request, res: Response) => {
  try {
    const { period } = req.query; // "day" | "month"

    const now = new Date();
    let startDate = new Date(0);

    if (period === "day") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Fetch attendance records
    const records = await Attendance.find({
      date: { $gte: startDate },
    }).sort({ date: -1 });

    // Summary counts
    const total = records.length;
    const interns = records.filter((r) => r.userType === "Intern").length;
    const staff = records.filter((r) => r.userType === "Staff").length;

    return sendResponse(res, 200, true, "Attendance summary fetched successfully", {
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

/* ===========================
 ✅ DISTANCE HELPER
=========================== */
function getDistanceFromLatLonInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
