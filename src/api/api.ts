import express from "express";
import { setupRoutes } from "./routes";

export function createApi() {
  const app = express();

  setupRoutes(app);

  app.listen(3000, () => {
    console.log("listening port 3000");
  });
}
