import { UserRepository } from "./user.repository.js";
import { UserService } from "./user.service.js";

const repository = new UserRepository();
const service = new UserService(repository);

export function runUserTest() {
  service.create("Marcopolo", "marcopolo@gmail.com");
  service.create("Mario Hugo", "mario@gmail.com");

  const users = service.getAll();

  console.log("Usuarios registrados:");
  console.log(users);
}