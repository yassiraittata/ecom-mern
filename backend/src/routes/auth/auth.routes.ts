import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { clerkClient, getAuth, User } from "@clerk/express";
import { User as UserModel } from "../../models/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { env } from "node:process";
import { ok } from "../../utils/envelop.js";

const router = Router();

router.post(
  "/sync",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);

    if (!userId) {
      throw new AppError("Unauthorized: User not authenticated", 401);
    }

    const clerkUser = await clerkClient.users.getUser(userId);

    const extractEmail =  
      clerkUser.emailAddresses.find(
        (email) => email.id === clerkUser.primaryEmailAddressId,
      ) || clerkUser.emailAddresses[0];

    const email = extractEmail?.emailAddress;
    const fullName = [clerkUser.firstName, clerkUser.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    const name = fullName || clerkUser.username;

    const raw = env.ADMIN_EMAILS || "";
    const adminEmails = new Set(
      raw
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean),
    );

    const existingUser = await UserModel.findOne({ clerkUserId: userId });
    const shouldBeAdmin = email ? adminEmails.has(email.toLowerCase()) : false;

    const nextRole =
      existingUser?.role === "admin"
        ? "admin"
        : shouldBeAdmin
          ? "admin"
          : existingUser?.role || "user";

    const newUser = await UserModel.findOneAndUpdate(
      { clerkUserId: userId },
      {
        clerkUserId: userId,
        email,
        name,
        role: nextRole,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    res.status(200).json(
      ok({
        user: {
          id: newUser._id,
          clerkUserId: newUser.clerkUserId,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      }),
    );
  }),
);

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);

    if (!userId) {
      throw new AppError("Unauthorized: User not authenticated", 401);
    }

    const user = await UserModel.findOne({ clerkUserId: userId });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json(
      ok({
        user: {
          id: user._id,
          clerkUserId: user.clerkUserId,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      }),
    );
  }),
);

export default router;
