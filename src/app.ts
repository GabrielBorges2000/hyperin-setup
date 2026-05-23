import { hyperin } from "hyperin";
import { json } from "hyperin/middleware";
import { registeRoutes } from "./routes";
import { registerDocs } from "./lib/scalar";

const app = hyperin();
app.use(json());

registeRoutes(app);
registerDocs(app);

export { app };
