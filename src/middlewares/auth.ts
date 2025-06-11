import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { UserRole } from "../types/userRoles";
import { JwtPayload } from "../types/jwt";
import { AuthorizedRequest } from "../types/request";

export function authMiddleware(): RequestHandler {
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
      const payload: JwtPayload = jwt.verify(token, ACCESS_SECRET) as JwtPayload;
      (req as AuthorizedRequest).user = payload;
      next();
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: "Invalid token." });
    }
  };
}

export function roleMiddleware(roles: UserRole[] = []): RequestHandler {
  return (req: AuthorizedRequest, res, next) => {
    if (roles.length === 0 || roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: "Access denied." });
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
