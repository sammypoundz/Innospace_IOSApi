"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Ensure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET;
// `expiresIn` should match SignOptions["expiresIn"]
const generateToken = (payload, expiresIn = "7d") => {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyToken = verifyToken;
