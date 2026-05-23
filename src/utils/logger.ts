import { createLogger } from "hyperin/logger";

export const logger = createLogger({
  kind: "audit",
  level: "info",
  transports: [
    async function ({ event }) {
      const loggerMessage = `${event.timestamp} [${event.level}] message: ${event.message}; attributes: ${JSON.stringify(event.attributes)}`;
      console.log(loggerMessage);
    },
  ],
});s