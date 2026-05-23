import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z
    .url()
    .default("postgres://docker:docker@localhost:5432/hyperin"),
  PORT: z.coerce.number().default(3333),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error(
    "❌ Variaveis de ambientes invalidas ou faltando!",
    z.flattenError(_env.error),
  );

  throw new Error("❌ Variaveis de ambientes invalidades ou faltando!");
}

export const env = _env.data;
