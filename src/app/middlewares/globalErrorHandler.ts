/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";

export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
  });
}
