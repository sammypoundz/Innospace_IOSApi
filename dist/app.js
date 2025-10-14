"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // ✅ Load env first — before anything else
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Connect Database
(0, db_1.connectDB)();
// Default Route
app.get("/", (_req, res) => {
    res.send("🚀 InnospaceX Backend Running...");
});
// Register all routes
app.use("/api", routes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map