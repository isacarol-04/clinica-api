import { dataSource } from "./data-source";
import { User } from "./entities/User";
import { userService } from "./services/user";

export async function seed() {
  const isEmpty = await isDatabaseEmpty();
  if (!isEmpty) {
    console.log("Skipping Seed. Database is not empty.");
    return;
  }

  console.log("Running Seed...");
  await userService.createUser({
    name: "admin",
    cpf: "1",
    email: "admin@admin.com",
    password: "admin123",
    role: "admin",
  });
  console.log("Default user created succesfully.");
}

async function isDatabaseEmpty(): Promise<boolean> {
  return !(await dataSource.getRepository(User).exists());
}
