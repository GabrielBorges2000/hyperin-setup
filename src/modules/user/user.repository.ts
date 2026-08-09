import type { Prisma, User } from "@/database/client";

export interface IUserRepository {
  create(data: Prisma.UserCreateInput): Promise<User>;
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
  delete(id: string): Promise<User | null>;
}
