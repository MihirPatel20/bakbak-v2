// logger.js
import winston from "winston";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { format as formatDate } from "date-fns"; // Import format from date-fns

const { createLogger, format, transports } = winston;
const { combine, timestamp, json, printf } = format;

// Ensure logs directory exists
const logDir = "logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Custom format for console logging, coloring only the response message
const consoleFormat = printf(
  ({ timestamp, method, endpoint, message, username, responseSuccess }) => {
    const formattedTimestamp = formatDate(
      new Date(timestamp),
      "dd-MM-yyyy HH:mm:ss"
    );
    const coloredTimestamp = chalk.cyan(formattedTimestamp); // Cyan for timestamp
    const coloredMethod = chalk.yellow(method); // Yellow for method

    const coloredMessage = responseSuccess
      ? chalk.green(message) // Green for success
      : chalk.red(message); // Red for failure

    return `\n${coloredTimestamp} [User: ${username}]\nendpoint: [${coloredMethod}] ${endpoint}\n${coloredMessage}`;
  }
);

const createCustomLogger = (level, filename) => {
  return createLogger({
    level,
    format: combine(timestamp(), json()),
    transports: [
      new transports.Console({ format: consoleFormat }),
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
const activityLogger = createCustomLogger("info", "user-activity.log");
const errorLogger = createCustomLogger("error", "errors.log");

export { logger, activityLogger, errorLogger };
