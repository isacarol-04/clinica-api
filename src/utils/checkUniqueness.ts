import { getUserByEmail, getUserByCpf } from "../services/userService";

export async function checkEmailUniqueness(email: string, userIdToIgnore?: number) {
  const existingUser = await getUserByEmail(email);
  if (existingUser && existingUser.id !== userIdToIgnore) {
    const error = new Error("Email already exists");
    (error as any).statusCode = 409;
    throw error;
  }
}

export async function checkCpfUniqueness(cpf: string, userIdToIgnore?: number) {
  const existingUser = await getUserByCpf(cpf);
  if (existingUser && existingUser.id !== userIdToIgnore) {
    const error = new Error("CPF already exists");
    (error as any).statusCode = 409;
    throw error;
  }
}