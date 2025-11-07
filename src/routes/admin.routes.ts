import { Router } from "express";
import { upload } from "../middleware/upload.middleware";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

import {
  /* Intern */
  getAllInterns,
  getSiwes,
  getInterns,
  uploadAcceptance,
  uploadCertificate,
  acceptIntern,
  deleteIntern,
  createManualIntern,

  /* Staff ✅ */
  getAllStaff,
  createManualStaff,
  updateStaffRole,
  deleteStaff,

  /* Dashboard */
  getAdminDashboardSummary,
} from "../controllers/admin.controller";

const router = Router();

// ✅ Protect all admin routes → Only ED & HeadDev can access
router.use(protect, authorize("ED", "HeadDev"));

/* =============================
   📊 DASHBOARD SUMMARY
============================= */
router.get("/summary", getAdminDashboardSummary);

/* =============================
   👨‍🎓 INTERN MANAGEMENT
============================= */
router.get("/interns", getAllInterns);
router.get("/interns/siwes", getSiwes);
router.get("/interns/interns", getInterns);

router.post("/interns/manual", createManualIntern);
router.post("/interns/:id/acceptance", upload.single("acceptanceLetter"), uploadAcceptance);
router.post("/interns/:id/certificate", upload.single("certificate"), uploadCertificate);

router.put("/interns/:id/accept", acceptIntern);
router.delete("/interns/:id", deleteIntern);

/* =============================
   👔 STAFF MANAGEMENT ✅
============================= */
router.get("/staff", getAllStaff);                // ✅ Get all staff
router.post("/staff/manual", createManualStaff);  // ✅ Create staff
router.put("/staff/:id/role", updateStaffRole);   // ✅ Update staff role
router.delete("/staff/:id", deleteStaff);         // ✅ Delete staff

export default router;
