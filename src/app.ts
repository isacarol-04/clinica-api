import express from "express";
import { setupRoutes } from "./routes";
import { env } from "./config/env";

const PORT = env.PORT;

export async function createApi() {
  const app = express();

  app.use(express.json());
  setupRoutes(app); 

  return new Promise<void>((resolve, reject) => {
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      resolve();
    });

    server.on("error", (err) => {
      console.error("Error starting the API:", err);
      reject(err);
    });
  });
}
