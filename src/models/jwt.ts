import { UserRole } from "./user";

export type JwtPayload = {
  id: number;
  email: string;
  role: UserRole;
};
