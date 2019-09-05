import winston from "winston";
import WinstonSentry from "winston-sentry";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

if (process.env.NODE_ENV === "production") {
  logger.transports.push(
    new WinstonSentry({
      level: "warn",
      dsn: "https://2c4b56212189488a9c187d25d739a19c@sentry.io/1516501",
    }),
  );
}
