"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFinanceSummary = exports.getRevenues = exports.addRevenue = exports.getExpenses = exports.addExpense = exports.getBudgets = exports.createBudget = void 0;
const finance_model_1 = require("../models/finance.model");
const response_1 = require("../utils/response");
/* =============================
   📊 BUDGET
============================= */
const createBudget = async (req, res) => {
    const { title, amount, department, createdBy } = req.body;
    const budget = new finance_model_1.Budget({ title, amount, department, createdBy });
    await budget.save();
    return (0, response_1.sendResponse)(res, 201, true, "Budget created successfully", budget);
};
exports.createBudget = createBudget;
const getBudgets = async (_req, res) => {
    const budgets = await finance_model_1.Budget.find().sort({ createdAt: -1 });
    return (0, response_1.sendResponse)(res, 200, true, "Budgets fetched", budgets);
};
exports.getBudgets = getBudgets;
/* =============================
   💸 EXPENSES
============================= */
const addExpense = async (req, res) => {
    const { title, amount, category, addedBy, description } = req.body;
    const expense = new finance_model_1.Expense({ title, amount, category, addedBy, description });
    await expense.save();
    return (0, response_1.sendResponse)(res, 201, true, "Expense added successfully", expense);
};
exports.addExpense = addExpense;
const getExpenses = async (_req, res) => {
    const expenses = await finance_model_1.Expense.find().sort({ createdAt: -1 });
    return (0, response_1.sendResponse)(res, 200, true, "Expenses fetched", expenses);
};
exports.getExpenses = getExpenses;
/* =============================
   💰 REVENUE
============================= */
const addRevenue = async (req, res) => {
    const { source, amount, receivedBy, description } = req.body;
    const revenue = new finance_model_1.Revenue({ source, amount, receivedBy, description });
    await revenue.save();
    return (0, response_1.sendResponse)(res, 201, true, "Revenue recorded successfully", revenue);
};
exports.addRevenue = addRevenue;
const getRevenues = async (_req, res) => {
    const revenues = await finance_model_1.Revenue.find().sort({ createdAt: -1 });
    return (0, response_1.sendResponse)(res, 200, true, "Revenues fetched", revenues);
};
exports.getRevenues = getRevenues;
/* =============================
   📈 FINANCIAL SUMMARY
============================= */
const getFinanceSummary = async (_req, res) => {
    var _a, _b, _c, _d, _e;
    const totalExpenses = await finance_model_1.Expense.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = await finance_model_1.Revenue.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalBudget = await finance_model_1.Budget.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const summary = {
        totalBudget: ((_a = totalBudget[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
        totalRevenue: ((_b = totalRevenue[0]) === null || _b === void 0 ? void 0 : _b.total) || 0,
        totalExpenses: ((_c = totalExpenses[0]) === null || _c === void 0 ? void 0 : _c.total) || 0,
        netBalance: (((_d = totalRevenue[0]) === null || _d === void 0 ? void 0 : _d.total) || 0) - (((_e = totalExpenses[0]) === null || _e === void 0 ? void 0 : _e.total) || 0),
    };
    return (0, response_1.sendResponse)(res, 200, true, "Finance summary fetched", summary);
};
exports.getFinanceSummary = getFinanceSummary;
