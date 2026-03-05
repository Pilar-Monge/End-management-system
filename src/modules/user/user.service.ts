import { randomUUID } from "node:crypto";
import type { User } from "./user.model.js";
import { UserRepository } from "./user.repository.js";

export class UserService {
  constructor(private readonly repository: UserRepository) {}

  create(fullName: string, email: string): User {
    const newUser: User = {
      id: randomUUID(),
      fullName,
      email,
      role: "WORKER",
      createdAt: new Date()
    };

    return this.repository.create(newUser);
  }

  getAll(): User[] {
    return this.repository.findAll();
  }
}