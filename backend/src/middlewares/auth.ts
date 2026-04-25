import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const { userId } = getAuth(req);
  if (!userId) {
    return next(new AppError("Unauthorized: User not authenticated", 401));
  }
  next();
}

export async function getDbUserFromReq(req: Request) {
  const { userId } = getAuth(req);
  if (!userId) {
    throw new AppError("Unauthorized: User not authenticated", 401);
  }

  const dbUser = await User.findOne({ clerkUserId: userId });

  if (!dbUser) {
    throw new AppError("User not found in database", 404);
  }

  return dbUser;
}

export const requireAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const dbUser = await getDbUserFromReq(req);

    if (dbUser?.role !== "admin") {
      throw new AppError("Forbidden: Admins only", 403);
    }
    next();
  },
);
