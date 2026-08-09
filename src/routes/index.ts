import type { Application } from "hyperin";
import { registerUserRoutes } from "@/modules/user/routes";

export function registeRoutes(app: Application) {
  registerUserRoutes(app);
}
