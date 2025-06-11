import { Request, RequestHandler, Response, NextFunction } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../services/userService";
import { createUserSchema, updateUserSchema } from "../validations/user";
import { CreateUserDTO } from "../dtos/user.dto";
import { createError } from "../utils/createError";
import { getAppointmentsByUserId } from "../services/appointmentService";
import { AuthorizedRequest } from "../types/request";
import { UserRole } from "../types/userRoles";

export function getUsers(): RequestHandler {
  return async (_: Request, res: Response, next: NextFunction) => {
    try {
      const users = await getAllUsers();
      res.json(users);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      next(error);
    }
  };
}

export function getUserByIdController(): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw createError("Invalid user id", 400);
      }

      const user = await getUserById(id);
      if (!user) {
        throw createError("User not found.", 404);
      }

      res.json(user);
    } catch (error: any) {
      console.error("Error fetching user:", error);
      next(error);
    }
  };
}

export function createUserController(): RequestHandler {
  return async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    try {
      const access = req.user;
      const validatedForm = await createUserSchema.validateAsync(req.body, {
        abortEarly: false,
      });
      const userForm = validatedForm as CreateUserDTO;

      if (access.role == UserRole.DOCTOR) {
        userForm.role = UserRole.PATIENT;
      }

      const user = await createUser(userForm);

      res.status(201).json(user);
    } catch (error: any) {
      console.error("Error creating user:", error);
      if (error.isJoi) {
        const errors = error.details.map((detail: any) => detail.message);
        res.status(400).json({ errors });
        return;
      }
      next(error);
    }
  };
}

export function updateUserController(): RequestHandler {
  return async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    try {
      const access = req.user;
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw createError("Invalid user id", 400);
      }

      let validatedForm = await updateUserSchema.validateAsync(req.body, {
        abortEarly: false,
      });

      const userToUpdate = await getUserById(id);
      if (!userToUpdate) {
        throw createError("User not found.", 404);
      }

      if (access.role != UserRole.ADMIN) {
        console.log("entrei")
        validatedForm.role = userToUpdate.role;
      }

      const updatedUser = await updateUser(id, validatedForm);
      res.json(updatedUser);
    } catch (error: any) {
      console.error("Error updating user:", error);
      if (error.isJoi) {
        const errors = error.details.map((detail: any) => detail.message);
        res.status(400).json({ errors });
        return;
      }
      next(error);
    }
  };
}

export function deleteUserController(): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw createError("Invalid user id", 400);
      }

      const appointments = await getAppointmentsByUserId(id);
      if (appointments.length > 0) {
        throw createError(
          "Cannot delete user with scheduled appointments",
          409
        );
      }

      const deletedUser = await deleteUser(id);

      if (!deletedUser) {
        throw createError("User not found.", 404);
      }
      res.json({ message: "User deleted successfully", id });
    } catch (error: any) {
      console.error("Error deleting user:", error);
      next(error);
    }
  };
}
