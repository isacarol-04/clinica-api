import { Request, Response } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../services/userService";
import { createUserSchema, updateUserSchema } from "../validations/user";
import { CreateUserDTO } from "../dtos/user.dto";

export const getUsers = async (_: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const createUserController = async (req: Request, res: Response) => {
  try {
    const validatedForm = await createUserSchema.validateAsync(req.body);
    const userForm = validatedForm as CreateUserDTO;
    const user = await createUser(userForm);

    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.isJoi) {
      res.status(400).json({ message: error.message });
      return;
    }
    const status = error.statusCode || 500;
    const message = status === 500 ? "Internal server error." : error.message;

    res.status(status).json({ message });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid user id" });
      return;
    }
    const validatedForm = await updateUserSchema.validateAsync(req.body);

    const userToUpdate = await getUserById(id);
    if (!userToUpdate) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const updatedUser = await updateUser(id, validatedForm);

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);

    if (error.isJoi) {
      res.status(400).json({ message: error.message });
      return;
    }

    const status = error.statusCode || 500;
    const message = status === 500 ? "Internal server error." : error.message;

    res.status(status).json({ message });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid user id" });
      return;
    }

    const deletedUser = await deleteUser(id);

    if (!deletedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ message: "User deleted successfully", id });
    return;
  } catch (error) {
    console.error("Error deleting user:", error);
    const status = error.statusCode || 500;
    const message = status === 500 ? "Internal server error." : error.message;

    res.status(status).json({ message });
  }
};
