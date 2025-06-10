import { getUserByIdAndRole } from "../services/userService";

export async function checkUserExistsByRole(userId: number, role: string): Promise<boolean> {
  const user = await getUserByIdAndRole(userId, role);
  return !!user;
}