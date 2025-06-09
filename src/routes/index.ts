import { Express, Router } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";

export function setupRoutes(app: Express) {
  const router = Router();

  app.get("/", (_, res) => {
    res.send("API is working");
  });
  router.use("/users", userRoutes);
  router.use("/auth", authRoutes);

  app.use("/api/v1", router);
}
