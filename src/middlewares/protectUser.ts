import { NextFunction, Response } from "express";
import { getUserById } from "../services/userService";
import { AuthorizedRequest } from "../types/request";
import { createError } from "../utils/createError";

export const protectUser = async (
  req: AuthorizedRequest,
  _: Response,
  next: NextFunction
) => {
  try {
    const access = req.user;
    const userId = Number(req.params.id);
    if (isNaN(userId)) {
      throw createError("User id is not a number.", 400);
    }

    if (userId == access.id) {
      next();
      return;
    }

    const user = await getUserById(userId);
    if (user == null) {
    }
    console.log(access, user)

    if (access.role == "admin") {
      next();
      return;
    }

    if (access.role == "doctor" && user.role != "admin") {
      next();
      return;
    }

    throw createError("Access denied.", 403);
  } catch (err) {
    next(err);
  }
};
