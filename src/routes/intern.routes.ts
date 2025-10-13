import { Router } from "express";
import { upload } from "../middleware/upload.middleware";
import { registerIntern, markAttendance, getInternDetails } from "../controllers/intern.controller";

const router = Router();

router.post(
  "/register",
  upload.fields([
    { name: "siwesForm", maxCount: 1 },
    { name: "paymentProof", maxCount: 1 },
  ]),
  registerIntern
);
router.post("/attendance", markAttendance);
router.get("/details/:phone", getInternDetails);

export default router;
