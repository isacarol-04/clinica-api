import express from "express";
import { setupRoutes } from "./routes";

const PORT = process.env.PORT || 3000;

export function createApi() {
  try {
    const app = express();

    app.use(express.json());
    setupRoutes(app);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Error starting the API:", error);
    process.exit(1); 
  }
}
