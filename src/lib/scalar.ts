import { scalar } from "hyperin/scalar";
import type { Application } from "hyperin";
import { openapi } from "hyperin/openapi";

export function registerDocs(app: Application) {
  openapi(app)
  scalar(app, {
    path: "/docs",
    url: "/openapi.json",
    configuration: {
      theme: "kepler",
      layout: "modern",
    },
  });
}
