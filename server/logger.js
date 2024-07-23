// logger.js
import winston from "winston";
import fs from "fs";
import path from "path";

const { createLogger, format, transports } = winston;
const { combine, timestamp, json, prettyPrint } = format;

// Ensure logs directory exists
const logDir = "logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const createCustomLogger = (level, filename) => {
  return createLogger({
    level,
    format: combine(timestamp(), json()),
    transports: [
      new transports.Console({
        format: combine(timestamp(), json(), prettyPrint()),
      }),
      new transports.File({
        filename: path.join(logDir, filename),
        format: combine(timestamp(), json()),
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
    ],
  });
};

const logger = createCustomLogger("info", "app.log");
const activityLogger = createCustomLogger("info", "api-interactions.log");
const errorLogger = createCustomLogger("error", "errors.log");

export { logger, activityLogger, errorLogger };
