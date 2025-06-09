import { Request, Response } from "express";
import { userService } from "../services/UserService";

export const getUsers = async (_: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
