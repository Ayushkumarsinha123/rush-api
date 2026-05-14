import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt.js";
import { logger } from "../lib/logger.js";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // 1. Check if token exists in headers
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Not authorized, no token provided" });
    }

    // 2. Verify token
    const decoded = verifyToken(token);

    // 3. Attach user to request
    //strict production app, you might also check if the user still exists in DB
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    logger.error("Auth Middleware Error:", error);
    return res.status(401).json({ error: "Not authorized, invalid token" });
  }
};