import { CreateUserDTO, UpdateUserDTO } from "../dtos/user.dto";
import { UserRole } from "../types/userRoles";
import { hashPassword } from "../utils/hash";
import { dataSource } from "../config/database";
import { User } from "../entities/User";
import {
  checkEmailUniqueness,
  checkCpfUniqueness,
} from "../utils/checkUniqueness";

const userRepo = dataSource.getRepository(User);

export async function createUser(form: CreateUserDTO): Promise<User> {
  const hashedPassword = await hashPassword(form.password);

  await checkEmailUniqueness(form.email);
  if (form.cpf) {
    await checkCpfUniqueness(form.cpf);
  }

  const user = userRepo.create({
    ...form,
    password: hashedPassword,
    role: form.role as UserRole,
  });
  const saved = await userRepo.save(user);

  const savedUser = await userRepo.findOne({
    where: { id: saved.id },
  });

  return savedUser;
}

export async function updateUser(
  id: number,
  form: UpdateUserDTO
): Promise<User | null> {
  const user = await userRepo.findOneBy({ id });
  if (!user) {
    return null;
  }

  if (form.email && form.email !== user.email) {
    await checkEmailUniqueness(form.email, id);
  }

  if (form.cpf && form.cpf !== user.cpf) {
    await checkCpfUniqueness(form.cpf, id);
  }

  if (form.password) {
    form.password = await hashPassword(form.password);
  }
  const updatedUser = await userRepo.preload({
    id,
    ...form,
  });
  const saved = await userRepo.save(updatedUser);

  const savedUser = await userRepo.findOne({
    where: { id: saved.id },
  });

  return savedUser;
}

export async function getAllUsers(): Promise<User[]> {
  return await userRepo.find();
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return await userRepo.findOneBy({ email });
}

export async function getUserByCpf(cpf: string): Promise<User | null> {
  return await userRepo.findOneBy({ cpf });
}

export async function getUserById(id: number): Promise<User | null> {
  return await userRepo.findOneBy({ id });
}

export async function getUserByIdAndRole(
  id: number,
  role: string
): Promise<User | null> {
  return await userRepo.findOneBy({ id, role });
}

export async function getUserJWTInfo(email: string): Promise<User | null> {
  return userRepo.findOne({
    where: { email },
    select: ["id", "role", "password"],
  });
}

export async function deleteUser(id: number): Promise<boolean> {
  const user = await userRepo.findOneBy({ id });
  if (!user) {
    return false;
  }

  await userRepo.remove(user);
  return true;
}
