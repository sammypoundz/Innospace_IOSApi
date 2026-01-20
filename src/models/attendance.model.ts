import mongoose, { Schema, Document } from "mongoose";

export interface IAttendance extends Document {
  userType: "Intern" | "Staff";
  userId: mongoose.Types.ObjectId;
  studentId: string; // INNO/SIWES/2026/001
  name: string;
  phone: string;
  date: Date;
  time: string;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    userType: {
      type: String,
      enum: ["Intern", "Staff"],
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "userType", // ✅ Intern or Staff dynamically
    },

    studentId: {
      type: String,
      required: true,
      trim: true,
      index: true, // ✅ fast lookup
    },

    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
      default: () => new Date(),
    },

    time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

/* ===========================
   🔒 PREVENT DOUBLE CHECK-IN
   One attendance per student per day
=========================== */
attendanceSchema.index(
  { studentId: 1, date: 1 },
  { unique: true }
);

export const Attendance = mongoose.model<IAttendance>(
  "Attendance",
  attendanceSchema
);
