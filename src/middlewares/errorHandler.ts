import { Request, Response } from "express";

export function errorHandler(
  err: any,
  _: Request,
  res: Response,
) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
}
