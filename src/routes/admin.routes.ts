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

  /* Staff */
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
router.get("/interns", getAllInterns);               // 🔹 All interns
router.get("/interns/siwes", getSiwes);              // 🔹 SIWES interns
router.get("/interns/interns", getInterns);          // 🔹 Regular interns
router.get("/interns/:studentId", getAllInterns);    // 🔹 Single intern by ID ✅

router.post("/interns/manual", createManualIntern);
router.post(
  "/interns/:id/acceptance",
  upload.single("acceptanceLetter"),
  uploadAcceptance
);
router.post(
  "/interns/:id/certificate",
  upload.single("certificate"),
  uploadCertificate
);

router.put("/interns/:id/accept", acceptIntern);
router.delete("/interns/:id", deleteIntern);

/* =============================
   👔 STAFF MANAGEMENT
============================= */
router.get("/staff", getAllStaff);
router.post("/staff/manual", createManualStaff);
router.put("/staff/:id/role", updateStaffRole);
router.delete("/staff/:id", deleteStaff);

export default router;
