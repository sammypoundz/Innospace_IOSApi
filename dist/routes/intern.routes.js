"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_middleware_1 = require("../middleware/upload.middleware");
const intern_controller_1 = require("../controllers/intern.controller");
const router = (0, express_1.Router)();
router.post("/register", upload_middleware_1.upload.fields([
    { name: "siwesForm", maxCount: 1 },
    { name: "paymentProof", maxCount: 1 },
]), intern_controller_1.registerIntern);
router.post("/attendance", intern_controller_1.markAttendance);
router.get("/details/:phone", intern_controller_1.getInternDetails);
exports.default = router;
