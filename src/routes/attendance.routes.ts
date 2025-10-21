import { Router } from "express";
import { markAttendance } from "../controllers/attendance.controller";

const router = Router();

router.post("/mark", markAttendance);

export default router;
