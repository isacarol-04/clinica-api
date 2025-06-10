import { UserRole } from "../models/userRoles";

export type CreateUserDTO = {
  name: string;
  email: string;
  role: UserRole;
  password: string;
  cpf?: string;
};

export type UpdateUserDTO = Partial<CreateUserDTO>;
