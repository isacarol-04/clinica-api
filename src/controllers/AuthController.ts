import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { getUserJWTInfo } from "../services/userService";
import { comparePassword } from "../utils/hash";
import { JwtPayload } from "../types/jwt";
import { UserRole } from "../types/userRoles";


export function login(): RequestHandler {
  const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
  const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

  return async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await getUserJWTInfo(email);
      if (!user) {
        res.status(401);
        res.json({ message: "Email or password is incorrect." });
        return;
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        res.status(401);
        res.json({ message: "Email or password is incorrect." });
        return;
      }

      const payload: JwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role as UserRole,
      };

      const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "1h" });
      const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });

      res.json({
        message: "Login successful.",
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500);
      res.json({ message: "Internal server error." });
    }
  };
}

export function refreshToken(): RequestHandler {
  const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
  const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

  return (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.sendStatus(401).json({ message: "Refresh token is required." });
      return;
    }

    try {
      const payload: JwtPayload = jwt.verify(refreshToken, REFRESH_SECRET);

      const accessToken = jwt.sign(
        {
          id: payload.id,
          email: payload.email,
          role: payload.role,
        },
        ACCESS_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        accessToken,
      });
    } catch (err) {
      console.log(err);
      res.sendStatus(401).json({ message: "Invalid refresh token." });
    }
  };
}