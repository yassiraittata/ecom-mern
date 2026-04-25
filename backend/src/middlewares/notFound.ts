import type { Request, Response } from "express";
import { fail } from "../utils/envelop.js";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json(fail("Route not Found: " + req.method));
}
