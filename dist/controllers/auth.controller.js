"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../models/user.model");
const jwt_1 = require("../utils/jwt");
const response_1 = require("../utils/response");
const register = async (req, res) => {
    try {
        const { fullname, email, password, role } = req.body;
        const existing = await user_model_1.User.findOne({ email });
        if (existing)
            return (0, response_1.sendResponse)(res, 400, false, "Email already exists");
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = new user_model_1.User({ fullname, email, password: hashedPassword, role });
        await user.save();
        return (0, response_1.sendResponse)(res, 201, true, "User registered successfully", {
            id: user._id,
            email: user.email,
            fullname: user.fullname,
        });
    }
    catch (err) {
        return (0, response_1.sendResponse)(res, 500, false, err.message);
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.User.findOne({ email });
        if (!user)
            return (0, response_1.sendResponse)(res, 400, false, "Invalid credentials");
        const validPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!validPassword)
            return (0, response_1.sendResponse)(res, 400, false, "Invalid credentials");
        const token = (0, jwt_1.generateToken)({
            id: user._id,
            email: user.email,
            role: user.role,
        });
        return (0, response_1.sendResponse)(res, 200, true, "Login successful", {
            token,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (err) {
        return (0, response_1.sendResponse)(res, 500, false, err.message);
    }
};
exports.login = login;
//# sourceMappingURL=auth.controller.js.map