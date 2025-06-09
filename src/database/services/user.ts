import { UserForm } from "../../models/user";
import { hashPassword } from "../../utils/hash";
import { dataSource } from "../data-source";
import { User } from "../entities/User";

export class UserService {
  private userRepo = dataSource.getRepository(User);

  async getAllUsers(): Promise<User[]> {
    return this.userRepo.find();
  }

  async createUser(form: UserForm): Promise<User> {
    form.password = await hashPassword(form.password);
    const user = this.userRepo.create({
      ...form,
    });
    return this.userRepo.save(user);
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userRepo.findOneBy({ email });
  }
}

export const userService = new UserService();
