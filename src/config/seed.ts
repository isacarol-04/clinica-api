import { dataSource } from "./database";
import { User } from "../entities/User";
import { createUser } from "../services/userService"; 
import { UserRole } from "../types/userRoles";

async function seed() {
  await dataSource.initialize();

  const isEmpty = await isDatabaseEmpty();
  if (!isEmpty) {
    console.log("Skipping Seed. Database is not empty.");
    await dataSource.destroy();
    return;
  }

  console.log("Running Seed...");

  await createUser({
    name: "admin",
    cpf: "00000000000",
    email: "admin@admin.com",
    password: "admin123",
    role: UserRole.ADMIN,
  });

  console.log("Default user created successfully.");

  await dataSource.destroy();
}

async function isDatabaseEmpty(): Promise<boolean> {
  const userCount = await dataSource.getRepository(User).count();
  return userCount === 0;
}

seed()
  .then(() => {
    console.log("Seed finished!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
