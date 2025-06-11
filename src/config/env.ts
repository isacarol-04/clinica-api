import { config } from "dotenv";
config();

export const env = {
  PORT: Number(process.env.PORT ?? "3000"),

  DB_HOST: process.env.DB_HOST ?? "localhost",
  DB_PORT: Number(process.env.DB_PORT ?? "5432"),
  DB_USER: process.env.DB_USER ?? "admin",
  DB_PASS: process.env.DB_PASS ?? "123456",
  DB_NAME: process.env.DB_NAME ?? "clinica",

  ADMIN_NAME: process.env.ADMIN_NAME ?? "admin",
  ADMIN_CPF: process.env.ADMIN_CPF ?? null,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL ?? "admin@admin.com",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? "admin123",

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ?? "default_access_secret",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? "7d",
  JWT_EXPIRATION: process.env.JWT_EXPIRATION ?? "1h",
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION ?? "7d",
};
