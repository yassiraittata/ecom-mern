import type { Request, Response, NextFunction } from "express";

import { AppError } from "../utils/AppError.js";
import { fail } from "../utils/envelop.js";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AppError) {
    console.error(err);
    return res.status(err.statusCode).json(fail(err.message, "APP_ERROR"));
  }

  console.error("Unexpected error: ", err);
  res.status(500).json(fail("Internal Server Error", "INTERNAL_ERROR"));
}
