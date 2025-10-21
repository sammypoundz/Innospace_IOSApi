import mongoose, { Schema, Document } from "mongoose";

export interface IAttendance extends Document {
  userType: "Intern" | "Staff";
  userId: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  date: Date;
  time: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

const attendanceSchema = new Schema<IAttendance>(
  {
    userType: { type: String, enum: ["Intern", "Staff"], required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, default: Date.now },
    time: { type: String },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

export const Attendance = mongoose.model<IAttendance>("Attendance", attendanceSchema);
