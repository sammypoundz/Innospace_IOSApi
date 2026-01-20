import mongoose, { Document, Schema } from "mongoose";

export interface IIntern extends Document {
  studentId: string; // INNO/SIWES/2026/001
  name: string;
  phone: string;
  email: string;
  school: string;
  category: "Intern" | "SIWES";
  course:
    | "Web Development"
    | "Mobile App Development"
    | "Backend Development"
    | "Cybersecurity"
    | "Data Analysis"
    | "UI/UX Design"
    | "Graphics Design"
    | "Others";
  siwesForm?: string;
  paymentProof?: string;
  acceptanceLetter?: string;
  certificate?: string;
  status: "Pending" | "Accepted" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}

const internSchema = new Schema<IIntern>(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true, // 🔍 fast QR lookup
    },

    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
    },

    school: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["Intern", "SIWES"],
      required: true,
    },

    course: {
      type: String,
      enum: [
        "Web Development",
        "Mobile App Development",
        "Backend Development",
        "Cybersecurity",
        "Data Analysis",
        "UI/UX Design",
        "Graphics Design",
        "Others",
      ],
      required: true,
    },

    siwesForm: { type: String },
    paymentProof: { type: String },
    acceptanceLetter: { type: String },
    certificate: { type: String },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Intern = mongoose.model<IIntern>("Intern", internSchema);
