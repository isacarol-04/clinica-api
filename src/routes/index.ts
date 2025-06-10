import { Express, Router } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import appointmentRoutes from "./appointmentRoutes";
import { errorHandler } from "../middlewares/errorHandler";

export function setupRoutes(app: Express) {
  const router = Router();

  router.get("/", (_, res) => {
    res.send("API is working");
  });
  router.use("/users", userRoutes);
  router.use("/auth", authRoutes);
  router.use("/appointments", appointmentRoutes)

  app.use("/api/v1", router);
  app.use(errorHandler);
}
