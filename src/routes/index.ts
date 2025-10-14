import { Router } from "express";
import authRoutes from "./auth.routes";
import internRoutes from "./intern.routes";
import adminRoutes from "./admin.routes";
import financeHubRoutes from "./financeHub.routes";

const router = Router();

// ✅ Authentication Routes
router.use("/auth", authRoutes);

// ✅ Intern (public) Routes
router.use("/interns", internRoutes);

// ✅ Admin Routes (protected — we'll add middleware later)
router.use("/admin", adminRoutes);

//Finance routes 
router.use("/finance", financeHubRoutes);

// ✅ API status check
router.get("/status", (_req, res) => {
  res.json({ status: "ok", message: "InnospaceX API is running" });
});

export default router;
