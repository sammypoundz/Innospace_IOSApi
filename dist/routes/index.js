"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const intern_routes_1 = __importDefault(require("./intern.routes"));
const admin_routes_1 = __importDefault(require("./admin.routes"));
const financeHub_routes_1 = __importDefault(require("./financeHub.routes"));
const router = (0, express_1.Router)();
// ✅ Authentication Routes
router.use("/auth", auth_routes_1.default);
// ✅ Intern (public) Routes
router.use("/interns", intern_routes_1.default);
// ✅ Admin Routes (protected — we'll add middleware later)
router.use("/admin", admin_routes_1.default);
//Finance routes 
router.use("/finance", financeHub_routes_1.default);
// ✅ API status check
router.get("/status", (_req, res) => {
    res.json({ status: "ok", message: "InnospaceX API is running" });
});
exports.default = router;
