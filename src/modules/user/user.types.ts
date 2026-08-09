import type { User } from "@/database/client";

export type SafeUser = Omit<User, "password">;

export class UserServiceError extends Error {
  readonly code: "USER_NOT_FOUND" | "EMAIL_IN_USE" | "INTERNAL_ERROR";
  readonly cause?: unknown;

  constructor(
    code: UserServiceError["code"],
    message: string,
    cause?: unknown,
  ) {
    super(message);
    this.name = "UserServiceError";
    this.code = code;
    this.cause = cause;
  }
}
