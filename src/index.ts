import "reflect-metadata";
import { dataSource } from "./database/data-source";
import { createApi } from "./api/api";
import { seed } from "./database/seed";
import { config } from "dotenv";

config(); // load env vars

dataSource
  .initialize()
  .then(async () => {
    await seed();
    createApi();
  })
  .catch((err) => {
    console.error("Erro ao inicializar o banco de dados:", err);
  });
