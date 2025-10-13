import { Router } from "express";
import { upload } from "../middleware/upload.middleware";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import {
  getAllInterns,
  getSiwes,
  getInterns,
  uploadAcceptance,
  uploadCertificate,
  acceptIntern,
  deleteIntern,
  createManualIntern,
} from "../controllers/admin.controller";

const router = Router();

// 🛡 Protect all admin routes — only ED and HeadDev can access
router.use(protect, authorize("ED", "HeadDev"));

// ✅ Admin endpoints
router.get("/interns", getAllInterns);
router.get("/interns/siwes", getSiwes);
router.get("/interns/interns", getInterns);

router.post("/interns/manual", createManualIntern);
router.post("/interns/:id/acceptance", upload.single("acceptanceLetter"), uploadAcceptance);
router.post("/interns/:id/certificate", upload.single("certificate"), uploadCertificate);

router.put("/interns/:id/accept", acceptIntern);
router.delete("/interns/:id", deleteIntern);

export default router;
