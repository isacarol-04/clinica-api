import "reflect-metadata";
import { config } from "dotenv";
config();

import { dataSource } from "./config/database";
import { createApi } from "./app";

async function start() {
  try {
    await dataSource.initialize();
    console.log("Database connected successfully.");
    createApi();
  } catch (err) {
    console.error("Error initializing the database:", err);
    process.exit(1);
  }
}

start();