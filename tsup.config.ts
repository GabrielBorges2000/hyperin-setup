import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  splitting: false,
  sourcemap: false,
  clean: true,
  target: ["node22"],
  noExternal: ["prisma"],
});
