"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = [".jpg", ".jpeg", ".png", ".pdf"];
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (!allowed.includes(ext)) {
            return cb(new Error("Only images or PDF files are allowed"));
        }
        cb(null, true);
    },
});
//# sourceMappingURL=upload.middleware.js.map