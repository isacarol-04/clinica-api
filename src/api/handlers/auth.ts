import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { UserRole } from "../../models/user";
import { JwtPayload } from "../../models/jwt";

export function authHandler(roles: UserRole[] = []): RequestHandler {
  const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    const token = getJWT(authHeader);
    if (!token) {
      res
        .sendStatus(401)
        .json({ message: "Authorization header missing or malformed." });
      return;
    }
    try {
      const payload: JwtPayload = jwt.verify(token, REFRESH_SECRET);
      if (roles.length === 0 || roles.find((role) => role == payload.role)) {
        next();
        return;
      }

      res.sendStatus(403).json({ message: "Access denied." });
    } catch (err) {
      res.sendStatus(401).json({ message: "Invalid refresh token." });
    }
  };
}

function getJWT(authHeader?: string): string | null {
  if (!authHeader) {
    return null;
  }
  const parts = authHeader.split(" ");
  if (parts.length !== 2 && parts[0] !== "Bearer") return null;

  return parts[1];
}
