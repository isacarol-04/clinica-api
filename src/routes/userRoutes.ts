import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../middlewares/auth";
import { UserRole } from "../types/userRoles";
import {
  getUsers,
  createUserController,
  updateUserController,
  deleteUserController,
  getUserByIdController,
} from "../controllers/userController";
import { protectUser } from "../middlewares/roleAuthorization";

const router = Router();
router.use(authMiddleware(), roleMiddleware([UserRole.ADMIN, UserRole.DOCTOR]));

router.get("/", getUsers());
router.get("/:id", protectUser, getUserByIdController());
router.post("/", createUserController());
router.put("/:id", protectUser, updateUserController());
router.delete("/:id", protectUser, deleteUserController());

export default router;
