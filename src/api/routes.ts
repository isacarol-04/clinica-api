import { Express, json, Router } from "express";
import { getUsersHandler } from "./handlers/users";
import { okHandler } from "./handlers/ok";
import { loginHandler, refreshTokenHandler } from "./handlers/login";
import { authHandler } from "./handlers/auth";

export function setupRoutes(app: Express) {
  const router = Router();

  router.use(json());

  router.get("/", okHandler());
  router.get("/users", authHandler(["admin", "doctor"]), getUsersHandler());
  router.post("/login", loginHandler());
  router.post("/refresh", refreshTokenHandler());

  app.use("/api/v1", router);
}
