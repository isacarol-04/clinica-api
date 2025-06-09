import { Router } from "express";
import { login, refreshToken } from "../controllers/AuthController";

const router = Router();

router.post("/login", login());
router.post("/refresh", refreshToken());

export default router;
