import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  fullname: string;
  email: string;
  phone: string; // ✅ Added phone field
  password: string;
  role: "ED" | "HeadDev" | "FinanceOfficer" | "Instructor" | "Staff";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true }, // ✅ Added phone field
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["ED", "HeadDev", "FinanceOfficer", "Instructor", "Staff"],
      default: "Staff",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
