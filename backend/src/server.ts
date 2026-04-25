import express from "express";
import cors from "cors";
import morgan from "morgan";
import { clerkMiddleware } from "@clerk/express";

import env from "./config/envalidate.js";
import connectDB from "./config/db.js";
import { notFoundHandler } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./routes/auth/auth.routes.js";

async function main() {
  await connectDB();
  const app = express();

  const corsOrigins = env.CORS_ORIGIN.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(cors({ origin: corsOrigins, credentials: true }));
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(clerkMiddleware());

  app.use("/auth", authRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const port = env.PORT;

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
