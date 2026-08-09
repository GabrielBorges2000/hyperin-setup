import type { Application } from "hyperin";
import { z } from "zod";

const bodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

type ResponseBody = z.infer<typeof bodySchema>;

export function registeRoutes(app: Application) {
  app.post(
    "/",
    ({ request, response }) => {
      const data = request.body as ResponseBody;

      response.json<ResponseBody>(data);
    },
    {
      summary: "Create User",
      tags: ["User"],
      body: bodySchema,
      responses: {
        200: {
          description: "User created successfully",
          schema: bodySchema,
        },
      },
    },
  );
}
