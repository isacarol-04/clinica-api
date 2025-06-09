import { Router } from "express";
import { authHandler } from "../middlewares/auth";
import { UserRole } from "../models/user";
import { getUsers } from "../controllers/UserController";

const router = Router();

router.use(authHandler([UserRole.DOCTOR, UserRole.ADMIN]));

router.get("/", getUsers);

export default router;
