import mongoose, { Document, Schema } from "mongoose";

export interface IIntern extends Document {
  name: string;
  phone: string;
  email: string;
  school: string;
  category: "Intern" | "SIWES";
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
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    school: { type: String, required: true },
    category: { type: String, enum: ["Intern", "SIWES"], required: true },
    siwesForm: { type: String },
    paymentProof: { type: String },
    acceptanceLetter: { type: String },
    certificate: { type: String },
    status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
  },
  { timestamps: true }
);

export const Intern = mongoose.model<IIntern>("Intern", internSchema);
