"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminDashboardSummary = exports.createManualIntern = exports.deleteIntern = exports.acceptIntern = exports.uploadCertificate = exports.uploadAcceptance = exports.getInterns = exports.getSiwes = exports.getAllInterns = void 0;
const intern_model_1 = require("../models/intern.model");
const finance_model_1 = require("../models/finance.model");
const response_1 = require("../utils/response");
/* =============================
   📄 INTERN MANAGEMENT
============================= */
const getAllInterns = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const interns = await intern_model_1.Intern.find()
        .skip((+page - 1) * +limit)
        .limit(+limit);
    const count = await intern_model_1.Intern.countDocuments();
    return (0, response_1.sendResponse)(res, 200, true, "All interns fetched", { interns, count });
};
exports.getAllInterns = getAllInterns;
const getSiwes = async (_req, res) => {
    const data = await intern_model_1.Intern.find({ category: "SIWES" });
    return (0, response_1.sendResponse)(res, 200, true, "SIWES students fetched", data);
};
exports.getSiwes = getSiwes;
const getInterns = async (_req, res) => {
    const data = await intern_model_1.Intern.find({ category: "Intern" });
    return (0, response_1.sendResponse)(res, 200, true, "Interns fetched", data);
};
exports.getInterns = getInterns;
const uploadAcceptance = async (req, res) => {
    const { id } = req.params;
    const acceptanceLetter = req.file?.path;
    const intern = await intern_model_1.Intern.findByIdAndUpdate(id, { acceptanceLetter }, { new: true });
    return (0, response_1.sendResponse)(res, 200, true, "Acceptance letter uploaded", intern);
};
exports.uploadAcceptance = uploadAcceptance;
const uploadCertificate = async (req, res) => {
    const { id } = req.params;
    const certificate = req.file?.path;
    const intern = await intern_model_1.Intern.findByIdAndUpdate(id, { certificate }, { new: true });
    return (0, response_1.sendResponse)(res, 200, true, "Certificate uploaded", intern);
};
exports.uploadCertificate = uploadCertificate;
const acceptIntern = async (req, res) => {
    const { id } = req.params;
    const intern = await intern_model_1.Intern.findByIdAndUpdate(id, { status: "Accepted" }, { new: true });
    return (0, response_1.sendResponse)(res, 200, true, "Intern accepted", intern);
};
exports.acceptIntern = acceptIntern;
const deleteIntern = async (req, res) => {
    const { id } = req.params;
    await intern_model_1.Intern.findByIdAndDelete(id);
    return (0, response_1.sendResponse)(res, 200, true, "Intern deleted");
};
exports.deleteIntern = deleteIntern;
const createManualIntern = async (req, res) => {
    const { name, phone, email, school, category } = req.body;
    const intern = new intern_model_1.Intern({ name, phone, email, school, category });
    await intern.save();
    return (0, response_1.sendResponse)(res, 201, true, "Intern created manually", intern);
};
exports.createManualIntern = createManualIntern;
/* =============================
   📊 ADMIN DASHBOARD SUMMARY
============================= */
const getAdminDashboardSummary = async (_req, res) => {
    try {
        // 🧮 Intern stats
        const totalInterns = await intern_model_1.Intern.countDocuments();
        const acceptedInterns = await intern_model_1.Intern.countDocuments({ status: "Accepted" });
        const pendingInterns = await intern_model_1.Intern.countDocuments({ status: { $ne: "Accepted" } });
        const siwesCount = await intern_model_1.Intern.countDocuments({ category: "SIWES" });
        const internCount = await intern_model_1.Intern.countDocuments({ category: "Intern" });
        // 💰 Finance stats
        const totalBudgetAgg = await finance_model_1.Budget.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
        const totalRevenueAgg = await finance_model_1.Revenue.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
        const totalExpenseAgg = await finance_model_1.Expense.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
        const totalBudget = totalBudgetAgg[0]?.total || 0;
        const totalRevenue = totalRevenueAgg[0]?.total || 0;
        const totalExpenses = totalExpenseAgg[0]?.total || 0;
        const netBalance = totalRevenue - totalExpenses;
        // 🧾 Recent transactions
        const recentExpenses = await finance_model_1.Expense.find().sort({ createdAt: -1 }).limit(5);
        const recentRevenues = await finance_model_1.Revenue.find().sort({ createdAt: -1 }).limit(5);
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
        return (0, response_1.sendResponse)(res, 200, true, "Admin dashboard summary fetched successfully", dashboardData);
    }
    catch (error) {
        console.error("Dashboard Summary Error:", error);
        return (0, response_1.sendResponse)(res, 500, false, "Failed to fetch dashboard summary", error);
    }
};
exports.getAdminDashboardSummary = getAdminDashboardSummary;
//# sourceMappingURL=admin.controller.js.map