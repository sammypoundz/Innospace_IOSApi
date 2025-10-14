"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const financeHub_controller_1 = require("../controllers/financeHub.controller");
const router = (0, express_1.Router)();
// 🛡 Only FO, ED, HeadDev can access
router.use(auth_middleware_1.protect, (0, role_middleware_1.authorize)("FO", "ED", "HeadDev"));
// Budgets
router.post("/budget", financeHub_controller_1.createBudget);
router.get("/budget", financeHub_controller_1.getBudgets);
// Expenses
router.post("/expense", financeHub_controller_1.addExpense);
router.get("/expense", financeHub_controller_1.getExpenses);
// Revenue
router.post("/revenue", financeHub_controller_1.addRevenue);
router.get("/revenue", financeHub_controller_1.getRevenues);
// Summary
router.get("/summary", financeHub_controller_1.getFinanceSummary);
exports.default = router;
