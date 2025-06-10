import { UserRole } from "./userRoles";

export type JwtPayload = {
  id: number;
  email: string;
  role: UserRole;
};
