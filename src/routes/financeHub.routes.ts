import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import {
  createBudget,
  getBudgets,
  addExpense,
  getExpenses,
  addRevenue,
  getRevenues,
  getFinanceSummary,
} from "../controllers/financeHub.controller";

const router = Router();

// 🛡 Only FO, ED, HeadDev can access
router.use(protect, authorize("FinanceOfficer", "ED", "HeadDev"));

// Budgets
router.post("/budget", createBudget);
router.get("/budget", getBudgets);

// Expenses
router.post("/expense", addExpense);
router.get("/expense", getExpenses);

// Revenue
router.post("/revenue", addRevenue);
router.get("/revenue", getRevenues);

// Summary
router.get("/summary", getFinanceSummary);

export default router;
