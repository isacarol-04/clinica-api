import "reflect-metadata";
import { DataSource } from "typeorm";

export const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "admin",
  password: "123456",
  database: "clinica",
  synchronize: true,
  logging: false,
  entities: ["src/database/entities/**/*.ts"],
  migrations: ["src/database/migration/**/*.ts"],
  subscribers: ["src/database/subscriber/**/*.ts"],
});
