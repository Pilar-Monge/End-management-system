import type { User } from "./user.model.js";

export class UserRepository {
  private users: User[] = [];

  create(user: User): User {
    this.users.push(user);
    return user;
  }

  findAll(): User[] {
    return this.users;
  }
}