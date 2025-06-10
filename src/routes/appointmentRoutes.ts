import { Router } from "express";
import {
  getAppointments,
  getAppointmentByIdController,
  createAppointmentController,
  updateAppointmentController,
  deleteAppointmentController,
} from "../controllers/appointmentController";
import { authMiddleware, roleMiddleware } from "../middlewares/auth";
import { UserRole } from "../types/userRoles";

const router = Router();

router.use(authMiddleware());

router.get("/", getAppointments());
router.get("/:id", getAppointmentByIdController());
router.post(
  "/",
  roleMiddleware([UserRole.ADMIN, UserRole.DOCTOR]),
  createAppointmentController()
);
router.put(
  "/:id",
  roleMiddleware([UserRole.ADMIN, UserRole.DOCTOR]),
  updateAppointmentController()
);
router.delete(
  "/:id",
  roleMiddleware([UserRole.ADMIN, UserRole.DOCTOR]),
  deleteAppointmentController()
);

export default router;
