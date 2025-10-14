import mongoose, { Schema, Document } from "mongoose";

/* =============================
   1️⃣ INTERFACES
============================= */

export interface IBudget extends Document {
  title: string;
  amount: number;
  department: string;
  createdBy: string;
  createdAt: Date;
}

export interface IExpense extends Document {
  title: string;
  amount: number;
  category: string;
  addedBy: string;
  description?: string;
  transactionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRevenue extends Document {
  source: string;
  amount: number;
  receivedBy: string;
  description?: string;
  transactionId: string;
  createdAt: Date;
  updatedAt: Date;
}

/* =============================
   2️⃣ SCHEMAS
============================= */

// 🔹 Budget Schema
const BudgetSchema = new Schema<IBudget>(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    department: { type: String, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

// 🔹 Expense Schema
const ExpenseSchema = new Schema<IExpense>(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    addedBy: { type: String, required: true },
    description: { type: String },
    transactionId: { type: String, unique: true },
  },
  { timestamps: true }
);

// 🔹 Revenue Schema
const RevenueSchema = new Schema<IRevenue>(
  {
    source: { type: String, required: true },
    amount: { type: Number, required: true },
    receivedBy: { type: String, required: true },
    description: { type: String },
    transactionId: { type: String, unique: true },
  },
  { timestamps: true }
);

/* =============================
   3️⃣ HOOKS — Generate Transaction IDs
============================= */

function generateTransactionId(prefix: string) {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

ExpenseSchema.pre<IExpense>("save", function (next) {
  if (!this.transactionId) this.transactionId = generateTransactionId("EXP");
  next();
});

RevenueSchema.pre<IRevenue>("save", function (next) {
  if (!this.transactionId) this.transactionId = generateTransactionId("REV");
  next();
});

/* =============================
   4️⃣ EXPORT MODELS
============================= */
export const Budget = mongoose.model<IBudget>("Budget", BudgetSchema);
export const Expense = mongoose.model<IExpense>("Expense", ExpenseSchema);
export const Revenue = mongoose.model<IRevenue>("Revenue", RevenueSchema);
