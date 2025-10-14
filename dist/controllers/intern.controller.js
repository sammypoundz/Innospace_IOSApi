"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInternDetails = exports.markAttendance = exports.registerIntern = void 0;
const intern_model_1 = require("../models/intern.model");
const response_1 = require("../utils/response");
// Register intern
const registerIntern = async (req, res) => {
    var _a, _b, _c, _d, _e, _f;
    try {
        const { name, phone, email, school, category } = req.body;
        const siwesForm = (_c = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.siwesForm) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.path;
        const paymentProof = (_f = (_e = (_d = req.files) === null || _d === void 0 ? void 0 : _d.paymentProof) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.path;
        const existing = await intern_model_1.Intern.findOne({ phone });
        if (existing)
            return (0, response_1.sendResponse)(res, 400, false, "Phone number already registered");
        const intern = new intern_model_1.Intern({
            name,
            phone,
            email,
            school,
            category,
            siwesForm,
            paymentProof,
        });
        await intern.save();
        return (0, response_1.sendResponse)(res, 201, true, "Intern registered successfully", intern);
    }
    catch (err) {
        return (0, response_1.sendResponse)(res, 500, false, err.message);
    }
};
exports.registerIntern = registerIntern;
// Attendance
const markAttendance = async (req, res) => {
    try {
        const { phone } = req.body;
        const intern = await intern_model_1.Intern.findOne({ phone });
        if (!intern)
            return (0, response_1.sendResponse)(res, 404, false, "Intern not found");
        return (0, response_1.sendResponse)(res, 200, true, "Attendance marked", { name: intern.name });
    }
    catch (err) {
        return (0, response_1.sendResponse)(res, 500, false, err.message);
    }
};
exports.markAttendance = markAttendance;
// Get intern details by phone
const getInternDetails = async (req, res) => {
    try {
        const { phone } = req.params;
        const intern = await intern_model_1.Intern.findOne({ phone });
        if (!intern)
            return (0, response_1.sendResponse)(res, 404, false, "Intern not found");
        return (0, response_1.sendResponse)(res, 200, true, "Intern details fetched", intern);
    }
    catch (err) {
        return (0, response_1.sendResponse)(res, 500, false, err.message);
    }
};
exports.getInternDetails = getInternDetails;
