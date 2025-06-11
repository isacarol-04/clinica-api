import { UserRole } from "../types/userRoles";

export interface CreateUserDTO {
  name: string;
  email: string;
  role: UserRole;
  password: string;
  cpf?: string;
}

export interface UpdateUserDTO extends Partial<CreateUserDTO> {}

export interface UserResponseDTO {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  cpf?: string;
}
