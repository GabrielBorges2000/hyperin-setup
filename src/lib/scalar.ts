import { scalar } from "hyperin/scalar";
import type { Application } from "hyperin";

export function registerDocs(app: Application) {
  scalar(app, {
    path: "/docs",
    url: "/openapi.json",
    configuration: {
      theme: "purple",
      layout: "modern",
    },
  });
}
