import { Router } from "express";
import { markAttendance,getAttendanceSummary } from "../controllers/attendance.controller";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
const router = Router();

router.post("/mark", markAttendance);
router.get("/attendance/summary", protect, authorize("ED", "FinanceOfficer", "HeadDev"), getAttendanceSummary);

export default router;
