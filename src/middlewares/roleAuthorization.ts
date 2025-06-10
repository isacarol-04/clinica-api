import { NextFunction, Request, Response } from "express";
import { getUserById } from "../services/userService";

export const authorizeUserAction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;
  if (!user || !user.role) {
    res.status(401).json({ message: "User not authenticated." });
    return;
  }

  const loggedUserRole = user.role;

  let roleOfTargetUser = req.body?.role;
  if (!roleOfTargetUser && req.params.id) {
    const targetUserId = Number(req.params.id);
    if (!isNaN(targetUserId)) {
      const targetUser = await getUserById(targetUserId);
      if (!targetUser) {
        res.status(404).json({ message: "Target user not found." });
        return;
      }
      roleOfTargetUser = targetUser.role;
    }
  }

  if (loggedUserRole === "admin") {
    next();
    return;
  }

  if (loggedUserRole === "doctor") {
    if (roleOfTargetUser === "patient") {
      next();
      return;
    } else {
      res
        .status(403)
        .json({
          message: "Doctor can only create, update or delete patients.",
        });
      return;
    }
  }

  res.status(403).json({ message: "Access denied." });
};
