import { getUserByEmail, getUserByCpf } from "../services/userService";
import { createError } from "../utils/createError";

export async function checkEmailUniqueness(
  email: string,
  userIdToIgnore?: number
) {
  const existingUser = await getUserByEmail(email);
  if (existingUser && existingUser.id !== userIdToIgnore) {
    throw createError("Email already exists", 409);
  }
}

export async function checkCpfUniqueness(cpf: string, userIdToIgnore?: number) {
  const existingUser = await getUserByCpf(cpf);
  if (existingUser && existingUser.id !== userIdToIgnore) {
    throw createError("CPF already exists", 409);
  }
}
