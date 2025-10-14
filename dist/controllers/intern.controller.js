"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInternDetails = exports.markAttendance = exports.registerIntern = void 0;
const intern_model_1 = require("../models/intern.model");
const response_1 = require("../utils/response");
// Register intern
const registerIntern = async (req, res) => {
    try {
        const { name, phone, email, school, category } = req.body;
        const siwesForm = req.files?.siwesForm?.[0]?.path;
        const paymentProof = req.files?.paymentProof?.[0]?.path;
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
//# sourceMappingURL=intern.controller.js.map