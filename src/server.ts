import { app } from "@/app";
import { checkConnectionDatabase } from "@/checks/check-database-connection";
import { env } from "./env";

const start = async () => {
  try {
    await checkConnectionDatabase();

    app.listen({
      host: "0.0.0.0",
      port: env.PORT ?? 3333,
    });

    console.log(`🚀 HTTP Server Running on http://localhost:3333`);
    console.log(
      `\u{1F4D6} Scalar documentation running at http://localhost:3333/docs`,
    );
  } catch (error) {
    console.error("🔴 Server error =>", error);
    process.exit(1);
  }
};

start();
