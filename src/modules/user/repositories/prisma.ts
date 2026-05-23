import type { PrismaClient, User } from "@/database/client";
import type { UserCreateInput, UserUpdateInput } from "@/database/models";
import type { IUserRepository } from "../user.repository";
import { prisma } from "@/lib/prisma";

export class UserPrismaRepository implements IUserRepository {
  constructor(private client?: PrismaClient) {}

  private get db() {
    return this.client ?? prisma;
  }

  async create(data: UserCreateInput): Promise<User> {
    return this.db.user.create({ data });
  }

  async getAll(): Promise<User[]> {
    return this.db.user.findMany();
  }

  async getById(id: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, data: UserUpdateInput): Promise<User> {
    return this.db.user.update({
      data,
      where: {
        id,
      },
    });
  }

  async delete(id: string): Promise<User | null> {
    return this.db.user.delete({
      where: {
        id,
      },
    });
  }
}
