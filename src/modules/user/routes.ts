import type { Application } from "hyperin";
import type { Response } from "hyperin/response";
import { validate } from "@/lib/hyperin-validation";
import { logger } from "@/utils/logger";
import { UserService } from "./user.service";
import { UserServiceError } from "./user.types";
import {
  createUserSchema,
  errorResponseSchema,
  updateUserSchema,
  userParamsSchema,
  userResponseSchema,
  usersListResponseSchema,
} from "./schemas";

const userService = new UserService();

const tags = ["Users"];
const notFoundResponse = {
  description: "User not found",
  schema: errorResponseSchema,
};

const conflictResponse = {
  description: "Email already in use",
  schema: errorResponseSchema,
};

const validationErrorResponse = {
  description: "Validation error",
  schema: errorResponseSchema,
};

function handleServiceError(response: Response, error: unknown): void {
  if (error instanceof UserServiceError) {
    if (error.code === "USER_NOT_FOUND") {
      response.status(404).json({ error: error.message });
      return;
    }
    if (error.code === "EMAIL_IN_USE") {
      response.status(409).json({ error: error.message });
      return;
    }
  }

  logger.error("Unexpected user service error: " + JSON.stringify(error));
  response.status(500).json({ error: "Internal server error" });
}

export function registerUserRoutes(app: Application) {
  app.post(
    "/users",
    async ({ request, response }) => {
      try {
        const body = request.body as {
          name: string;
          email: string;
          password: string;
        };

        const existingUser = await userService.getByEmail(body.email);
        if (existingUser) {
          response.status(409).json({ error: "Email already in use" });
          return;
        }

        const user = await userService.create(body);
        response.status(201).json({ user });
      } catch (error) {
        handleServiceError(response, error);
      }
    },
    {
      summary: "Create user",
      tags,
      body: createUserSchema,
      responses: {
        201: {
          description: "User created successfully",
          schema: userResponseSchema,
        },
        409: conflictResponse,
        422: validationErrorResponse,
      },
    },
  );

  app.get(
    "/users",
    async ({ response }) => {
      try {
        const users = await userService.list();
        response.json({ users });
      } catch (error) {
        handleServiceError(response, error);
      }
    },
    {
      summary: "List users",
      tags,
      responses: {
        200: {
          description: "List of users",
          schema: usersListResponseSchema,
        },
        422: validationErrorResponse,
      },
    },
  );

  app.get(
    "/users/:id",
    validate.params(userParamsSchema),
    async ({ request, response }) => {
      try {
        const { id } = request.params as { id: string };
        const user = await userService.getById(id);
        response.json({ user });
      } catch (error) {
        handleServiceError(response, error);
      }
    },
    {
      summary: "Get user by id",
      tags,
      params: userParamsSchema,
      responses: {
        200: {
          description: "User found",
          schema: userResponseSchema,
        },
        404: notFoundResponse,
        422: validationErrorResponse,
      },
    },
  );

  app.patch(
    "/users/:id",
    validate.params(userParamsSchema),
    validate.body(updateUserSchema),
    async ({ request, response }) => {
      try {
        const { id } = request.params as { id: string };
        const body = request.body as {
          name?: string;
          email?: string;
          password?: string;
        };
        const user = await userService.update(id, body);
        response.json({ user });
      } catch (error) {
        handleServiceError(response, error);
      }
    },
    {
      summary: "Update user",
      tags,
      params: userParamsSchema,
      body: updateUserSchema,
      responses: {
        200: {
          description: "User updated",
          schema: userResponseSchema,
        },
        404: notFoundResponse,
        409: conflictResponse,
        422: validationErrorResponse,
      },
    },
  );

  app.delete(
    "/users/:id",
    validate.params(userParamsSchema),
    async ({ request, response }) => {
      try {
        const { id } = request.params as { id: string };
        await userService.delete(id);
        response.status(204).send();
      } catch (error) {
        handleServiceError(response, error);
      }
    },
    {
      summary: "Delete user",
      tags,
      params: userParamsSchema,
      responses: {
        204: {
          description: "User deleted",
        },
        404: notFoundResponse,
        422: validationErrorResponse,
      },
    },
  );
}
