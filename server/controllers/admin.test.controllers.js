import fs from "fs/promises";
import { createReadStream } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";
import NodeCache from "node-cache";
import { subDays } from "date-fns";
import { USER_ACTIVITY_TYPES } from "../constants.js";

const desiredActivityTypesArray = [
  USER_ACTIVITY_TYPES.USER_REGISTRATION,
  USER_ACTIVITY_TYPES.USER_LOGIN,
  // USER_ACTIVITY_TYPES.USER_LOGOUT,
  // USER_ACTIVITY_TYPES.CREATE_POST,
  // USER_ACTIVITY_TYPES.COMMENT_ON_POST,
  // USER_ACTIVITY_TYPES.LIKE_COMMENT,
  USER_ACTIVITY_TYPES.SEND_MESSAGE,
  // USER_ACTIVITY_TYPES.RESET_PASSWORD,
  // USER_ACTIVITY_TYPES.FOLLOW_USER,
  // USER_ACTIVITY_TYPES.UNFOLLOW_USER,
];

// Resolve the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the cache
const cache = new NodeCache({ stdTTL: 10 }); // Cache TTL of 1 hour

// Function to parse and aggregate user activity
const aggregateUserActivity = async (startDate, endDate) => {
  const fileStream = createReadStream(
    path.resolve(__dirname, "../logs/random-activity.log")
  );
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const activityData = {};

  for await (const line of rl) {
    const log = JSON.parse(line);
    const logDate = new Date(log.timestamp).toISOString().split("T")[0]; // Format: YYYY-MM-DD

    if (logDate >= startDate && logDate <= endDate) {
      if (!activityData[logDate]) {
        activityData[logDate] = {};
      }

      const activityType = log.userActivityType || "unknown"; // Default to 'unknown'

      if (
        !desiredActivityTypesArray.some((type) => activityType.includes(type))
      ) {
        continue; // Skip if activityType does not include any element from desiredActivityTypesArray
      }

      if (!activityData[logDate][activityType]) {
        activityData[logDate][activityType] = 0;
      }
      activityData[logDate][activityType]++;
    }
  }

  return activityData;
};

const formatDateToYYYYMMDD = (date) => {
  return date.toISOString().split("T")[0];
};

export const getUserActivityChart = async (req, res) => {
  // Set default dates
  const defaultEndDate = new Date();
  const defaultStartDate = subDays(defaultEndDate, 60);

  // Use provided dates or defaults
  const endDate = req.query.endDate
    ? new Date(req.query.endDate)
    : defaultEndDate;
  const startDate = req.query.startDate
    ? new Date(req.query.startDate)
    : defaultStartDate;

  const formattedEndDate = formatDateToYYYYMMDD(endDate);
  const formattedStartDate = formatDateToYYYYMMDD(startDate);

  const cacheKey = `user_activity_${formattedStartDate}_${formattedEndDate}`;
  const cachedResult = cache.get(cacheKey);

  if (cachedResult) {
    return res.json(cachedResult);
  }

  try {
    const activityData = await aggregateUserActivity(
      formattedStartDate,
      formattedEndDate
    );

    // Cache the result
    cache.set(cacheKey, activityData);

    res.json(activityData);
  } catch (error) {
    res.status(500).json({ error: "Error processing log file" });
  }
};

// ---- -- - - -- - - --///
//
//
//
// Random Activity Log Generator
const endpoints = [
  "/api/v1/messages",
  "/api/v1/users/login",
  "/api/v1/users/logout",
  "/api/v1/like/post",
  // Add more endpoints as needed
];

const ipAddresses = [
  "192.168.0.1",
  "192.168.1.1",
  "::1",
  // Add more IP addresses as needed
];

const levels = ["info", "warn", "error"];
const methods = ["GET", "POST", "PUT", "DELETE"];
const responseStatuses = [200, 201, 400, 404, 500];
const userActivityTypes = Object.values(USER_ACTIVITY_TYPES);

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateRandomActivityLogs = (numberOfLogsPerDay) => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30); // 30 days ago

  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + dayOffset);

    Array.from({ length: numberOfLogsPerDay }).forEach(() => {
      const logDate = new Date(
        currentDate.getTime() + Math.floor(Math.random() * 86400000) // Random time within the day
      );

      data.push({
        endpoint: getRandomElement(endpoints),
        ipAddress: getRandomElement(ipAddresses),
        level: getRandomElement(levels),
        message: "Sample message",
        method: getRandomElement(methods),
        requestBody: {},
        responseData: {},
        responseStatus: getRandomElement(responseStatuses),
        responseSuccess: Math.random() > 0.5,
        responseTime: `${Math.floor(Math.random() * 100)}ms`,
        timestamp: logDate.toISOString(),
        user: `user_${Math.floor(Math.random() * 1000)}`,
        userActivityType: getRandomElement(desiredActivityTypesArray),
        isRandomLog: true,
      });
    });
  }

  return data;
};

const formatLogEntry = (log) => JSON.stringify(log);

const saveLogsToFile = async (numberOfLogsPerDay) => {
  try {
    const logs = generateRandomActivityLogs(numberOfLogsPerDay);
    const formattedLogs = logs.map(formatLogEntry).join("\n");

    const filePath = path.join(__dirname, "../logs", "random-activity.log");
    await fs.writeFile(filePath, formattedLogs);

    console.log(`Logs successfully saved to ${filePath}`);
  } catch (err) {
    console.error("Error writing to file:", err);
  }
};

const handleGenerateLogs = async (req, res) => {
  const numberOfLogsPerDay = parseInt(req.query.count, 10) || 100;

  await saveLogsToFile(numberOfLogsPerDay);

  res.send("Logs generated and saved successfully");
};

export { handleGenerateLogs };
