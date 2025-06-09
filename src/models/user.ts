export type UserRole = "admin" | "doctor" | "patient";

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  cpf: string;
  created_at: Date;
};

export type UserForm = {
  name: string;
  email: string;
  role: UserRole;
  cpf: string;
  password: string;
};
