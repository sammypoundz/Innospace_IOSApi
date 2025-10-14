"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_middleware_1 = require("../middleware/upload.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const admin_controller_1 = require("../controllers/admin.controller");
const router = (0, express_1.Router)();
// 🛡 Protect all admin routes — only ED and HeadDev can access
router.use(auth_middleware_1.protect, (0, role_middleware_1.authorize)("ED", "HeadDev"));
/* =============================
   📊 DASHBOARD SUMMARY ENDPOINT
============================= */
// ✅ Admin overview (Interns + Finance)
router.get("/summary", admin_controller_1.getAdminDashboardSummary);
/* =============================
   👨‍🎓 INTERN MANAGEMENT
============================= */
router.get("/interns", admin_controller_1.getAllInterns);
router.get("/interns/siwes", admin_controller_1.getSiwes);
router.get("/interns/interns", admin_controller_1.getInterns);
router.post("/interns/manual", admin_controller_1.createManualIntern);
router.post("/interns/:id/acceptance", upload_middleware_1.upload.single("acceptanceLetter"), admin_controller_1.uploadAcceptance);
router.post("/interns/:id/certificate", upload_middleware_1.upload.single("certificate"), admin_controller_1.uploadCertificate);
router.put("/interns/:id/accept", admin_controller_1.acceptIntern);
router.delete("/interns/:id", admin_controller_1.deleteIntern);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map