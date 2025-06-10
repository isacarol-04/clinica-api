import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { UserRole } from "../models/userRoles";
import { JwtPayload } from "../models/jwt";

export function authMiddleware(roles: UserRole[] = []): RequestHandler {
  const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = getJWT(authHeader);
    if (!token) {
      res
        .status(401)
        .json({ message: "Authorization header missing or malformed." });
      return;
    }
    try {
      const payload: JwtPayload = jwt.verify(token, ACCESS_SECRET);
      (req as any).user = payload;

      if (roles.length === 0 || roles.find((role) => role == payload.role)) {
        next();
        return;
      }

      res.status(403).json({ message: "Access denied." });
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: "Invalid token." });
    }
  };
}

function getJWT(authHeader?: string): string | null {
  if (!authHeader) {
    return null;
  }
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null; 
  return parts[1];
}
