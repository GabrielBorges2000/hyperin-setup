import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../database/client";
import { env } from "@/env";

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});
export const prisma = new PrismaClient({
  adapter,
  log: ["error", "warn"],
});
