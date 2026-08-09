import bcrypt from "bcryptjs";
import { Prisma } from "@/database/client";
import type { SafeUser } from "./user.types";
import { UserServiceError } from "./user.types";
import type { IUserRepository } from "./user.repository";
import { UserPrismaRepository } from "./repositories/prisma";
import type { CreateUserInput, UpdateUserInput } from "./schemas";

const BCRYPT_ROUNDS = 10;

export class UserService {
  constructor(private readonly repository: IUserRepository = new UserPrismaRepository()) {}

  async create(input: CreateUserInput): Promise<SafeUser> {
    const hashedPassword = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

    try {
      const user = await this.repository.create({
        name: input.name,
        email: input.email,
        password: hashedPassword,
      });

      return this.omitPassword(user);
    } catch (error) {
      throw this.mapPrismaError(error);
    }
  }

  async list(): Promise<SafeUser[]> {
    const users = await this.repository.getAll();
    return users.map((user) => this.omitPassword(user));
  }

  async getById(id: string): Promise<SafeUser> {
    const user = await this.repository.getById(id);
    if (!user) {
      throw new UserServiceError("USER_NOT_FOUND", "User not found");
    }
    return this.omitPassword(user);
  }

  async getByEmail(email: string): Promise<SafeUser | null> {
    const user = await this.repository.getByEmail(email);
    return user ? this.omitPassword(user) : null;
  }

  async update(id: string, input: UpdateUserInput): Promise<SafeUser> {
    const data: Prisma.UserUpdateInput = {};

    if (input.name !== undefined) data.name = input.name;
    if (input.email !== undefined) data.email = input.email;
    if (input.password !== undefined) {
      data.password = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    }

    try {
      const user = await this.repository.update(id, data);
      return this.omitPassword(user);
    } catch (error) {
      throw this.mapPrismaError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      throw this.mapPrismaError(error);
    }
  }

  private omitPassword(user: { password?: string | null }): SafeUser {
    const { password: _password, ...safe } = user;
    return safe as SafeUser;
  }

  private mapPrismaError(error: unknown): UserServiceError {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return new UserServiceError("USER_NOT_FOUND", "User not found");
      }
      if (error.code === "P2002") {
        const target = error.meta?.target;
        const fields = Array.isArray(target)
          ? (target as string[])
          : typeof target === "string"
            ? [target]
            : [];
        if (fields.includes("email")) {
          return new UserServiceError("EMAIL_IN_USE", "Email already in use");
        }
      }
    }
    if (error instanceof UserServiceError) return error;
    return new UserServiceError("INTERNAL_ERROR", "Unexpected error", error);
  }
}
