export type UserRole = "ADMIN_SYSTEM" | "WORKER";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}