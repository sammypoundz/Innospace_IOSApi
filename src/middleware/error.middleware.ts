import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("⚠️ Error:", err.message || err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
