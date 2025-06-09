import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { userService } from "../../database/services/user";
import { comparePassword } from "../../utils/hash";
import { JwtPayload } from "../../models/jwt";
import { UserRole } from "../../models/user";

export function loginHandler(): RequestHandler {
  const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
  const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

  return async (req, res) => {
    const { email, password } = req.body;
    const user = await userService.findUserByEmail(email);
    if (!user) {
      res.sendStatus(401).json({
        message: "Email or password is wrong.",
      });
      return;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      res.sendStatus(401).json({
        message: "Email or password is wrong.",
      });
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
  };
}

export function refreshTokenHandler(): RequestHandler {
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
