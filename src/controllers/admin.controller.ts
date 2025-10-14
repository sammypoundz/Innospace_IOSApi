import { Request, Response } from "express";
import { Intern } from "../models/intern.model";
import { Budget, Expense, Revenue } from "../models/finance.model";
import { sendResponse } from "../utils/response";

/* =============================
   📄 INTERN MANAGEMENT
============================= */
export const getAllInterns = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const interns = await Intern.find()
    .skip((+page - 1) * +limit)
    .limit(+limit);
  const count = await Intern.countDocuments();
  return sendResponse(res, 200, true, "All interns fetched", { interns, count });
};

export const getSiwes = async (_req: Request, res: Response) => {
  const data = await Intern.find({ category: "SIWES" });
  return sendResponse(res, 200, true, "SIWES students fetched", data);
};

export const getInterns = async (_req: Request, res: Response) => {
  const data = await Intern.find({ category: "Intern" });
  return sendResponse(res, 200, true, "Interns fetched", data);
};

export const uploadAcceptance = async (req: Request, res: Response) => {
  const { id } = req.params;
  const acceptanceLetter = (req.file as any)?.path;
  const intern = await Intern.findByIdAndUpdate(id, { acceptanceLetter }, { new: true });
  return sendResponse(res, 200, true, "Acceptance letter uploaded", intern);
};

export const uploadCertificate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const certificate = (req.file as any)?.path;
  const intern = await Intern.findByIdAndUpdate(id, { certificate }, { new: true });
  return sendResponse(res, 200, true, "Certificate uploaded", intern);
};

export const acceptIntern = async (req: Request, res: Response) => {
  const { id } = req.params;
  const intern = await Intern.findByIdAndUpdate(id, { status: "Accepted" }, { new: true });
  return sendResponse(res, 200, true, "Intern accepted", intern);
};

export const deleteIntern = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Intern.findByIdAndDelete(id);
  return sendResponse(res, 200, true, "Intern deleted");
};

export const createManualIntern = async (req: Request, res: Response) => {
  const { name, phone, email, school, category } = req.body;
  const intern = new Intern({ name, phone, email, school, category });
  await intern.save();
  return sendResponse(res, 201, true, "Intern created manually", intern);
};

/* =============================
   📊 ADMIN DASHBOARD SUMMARY
============================= */
export const getAdminDashboardSummary = async (_req: Request, res: Response) => {
  try {
    // 🧮 Intern stats
    const totalInterns = await Intern.countDocuments();
    const acceptedInterns = await Intern.countDocuments({ status: "Accepted" });
    const pendingInterns = await Intern.countDocuments({ status: { $ne: "Accepted" } });
    const siwesCount = await Intern.countDocuments({ category: "SIWES" });
    const internCount = await Intern.countDocuments({ category: "Intern" });

    // 💰 Finance stats
    const totalBudgetAgg = await Budget.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
    const totalRevenueAgg = await Revenue.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
    const totalExpenseAgg = await Expense.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);

    const totalBudget = totalBudgetAgg[0]?.total || 0;
    const totalRevenue = totalRevenueAgg[0]?.total || 0;
    const totalExpenses = totalExpenseAgg[0]?.total || 0;
    const netBalance = totalRevenue - totalExpenses;

    // 🧾 Recent transactions
    const recentExpenses = await Expense.find().sort({ createdAt: -1 }).limit(5);
    const recentRevenues = await Revenue.find().sort({ createdAt: -1 }).limit(5);

    // 📊 Final summary object
    const dashboardData = {
      interns: {
        total: totalInterns,
        accepted: acceptedInterns,
        pending: pendingInterns,
        siwes: siwesCount,
        intern: internCount,
      },
      finance: {
        totalBudget,
        totalRevenue,
        totalExpenses,
        netBalance,
      },
      recentTransactions: {
        expenses: recentExpenses,
        revenues: recentRevenues,
      },
    };

    return sendResponse(res, 200, true, "Admin dashboard summary fetched successfully", dashboardData);
  } catch (error) {
    console.error("Dashboard Summary Error:", error);
    return sendResponse(res, 500, false, "Failed to fetch dashboard summary", error);
  }
};
