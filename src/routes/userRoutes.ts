import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { UserRole } from "../models/userRoles";
import {
  getUsers,
  createUserController,
  updateUserController,
  deleteUserController,
} from "../controllers/userController";
import { authorizeUserAction } from "../middlewares/roleAuthorization";

const router = Router();
router.use(authMiddleware([UserRole.DOCTOR, UserRole.ADMIN]));

router.get("/", getUsers);

router.post("/", authorizeUserAction, createUserController);
router.put("/:id", authorizeUserAction, updateUserController);
router.delete("/:id", authorizeUserAction, deleteUserController);

export default router;	
