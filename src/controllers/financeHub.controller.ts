import { Request, Response } from "express";
import { Budget, Expense, Revenue } from "../models/finance.model";
import { sendResponse } from "../utils/response";

/* =============================
   📊 BUDGET
============================= */
export const createBudget = async (req: Request, res: Response) => {
  const { title, amount, department, createdBy } = req.body;
  const budget = new Budget({ title, amount, department, createdBy });
  await budget.save();
  return sendResponse(res, 201, true, "Budget created successfully", budget);
};

export const getBudgets = async (_req: Request, res: Response) => {
  const budgets = await Budget.find().sort({ createdAt: -1 });
  return sendResponse(res, 200, true, "Budgets fetched", budgets);
};

/* =============================
   💸 EXPENSES
============================= */
export const addExpense = async (req: Request, res: Response) => {
  const { title, amount, category, addedBy, description } = req.body;
  const expense = new Expense({ title, amount, category, addedBy, description });
  await expense.save();
  return sendResponse(res, 201, true, "Expense added successfully", expense);
};

export const getExpenses = async (_req: Request, res: Response) => {
  const expenses = await Expense.find().sort({ createdAt: -1 });
  return sendResponse(res, 200, true, "Expenses fetched", expenses);
};

/* =============================
   💰 REVENUE
============================= */
export const addRevenue = async (req: Request, res: Response) => {
  const { source, amount, receivedBy, description } = req.body;
  const revenue = new Revenue({ source, amount, receivedBy, description });
  await revenue.save();
  return sendResponse(res, 201, true, "Revenue recorded successfully", revenue);
};

export const getRevenues = async (_req: Request, res: Response) => {
  const revenues = await Revenue.find().sort({ createdAt: -1 });
  return sendResponse(res, 200, true, "Revenues fetched", revenues);
};

/* =============================
   📈 FINANCIAL SUMMARY
============================= */
export const getFinanceSummary = async (_req: Request, res: Response) => {
  const totalExpenses = await Expense.aggregate([
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const totalRevenue = await Revenue.aggregate([
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const totalBudget = await Budget.aggregate([
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const summary = {
    totalBudget: totalBudget[0]?.total || 0,
    totalRevenue: totalRevenue[0]?.total || 0,
    totalExpenses: totalExpenses[0]?.total || 0,
    netBalance: (totalRevenue[0]?.total || 0) - (totalExpenses[0]?.total || 0),
  };

  return sendResponse(res, 200, true, "Finance summary fetched", summary);
};
