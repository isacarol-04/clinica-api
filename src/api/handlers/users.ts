import type { RequestHandler } from "express";
import { dataSource } from "../../database/data-source";
import { User } from "../../database/entities/User";

export function getUsersHandler(): RequestHandler {
  return async (_, res) => {
    try {
      const userRepository = dataSource.getRepository(User);
      const users = await userRepository.find();

      res.json(users);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  };
}
