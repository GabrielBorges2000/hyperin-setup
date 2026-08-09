import { z } from "zod";

export const userParamsSchema = z.object({
  id: z.uuid(),
});

export const createUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.email("Invalid email").trim().toLowerCase(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(120),
});

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    email: z.email().trim().toLowerCase().optional(),
    password: z.string().min(6).max(120).optional(),
  })
  .refine(
    (data) => data.name !== undefined || data.email !== undefined || data.password !== undefined,
    { message: "At least one field must be provided" },
  );

export const userSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const usersListResponseSchema = z.object({
  users: z.array(userSchema),
});

export const userResponseSchema = z.object({
  user: userSchema,
});

export const errorResponseSchema = z.object({
  error: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserParams = z.infer<typeof userParamsSchema>;
