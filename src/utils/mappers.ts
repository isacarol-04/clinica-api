import { UserResponseDTO } from "../dtos/user.dto";
import { User } from "../entities/User";
import { UserRole } from "../types/userRoles";

export function toUserResponseDTO(user: User): UserResponseDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as UserRole,
    cpf: user.cpf,
  };
}