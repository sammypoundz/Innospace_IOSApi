import mongoose, { Schema, Document } from "mongoose";

export interface IAttendance extends Document {
  userType: "Intern" | "Staff";
  userId: mongoose.Types.ObjectId;
  studentId: string; // 👈 scanned ID (QR / card)
  name: string;
  phone: string;
  date: Date;
  time: string;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    userType: { type: String, enum: ["Intern", "Staff"], required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "Intern" },
    studentId: { type: String, required: true }, // 👈 important
    name: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, default: Date.now },
    time: { type: String, required: true },
  },
  { timestamps: true }
);

export const Attendance = mongoose.model<IAttendance>(
  "Attendance",
  attendanceSchema
);
