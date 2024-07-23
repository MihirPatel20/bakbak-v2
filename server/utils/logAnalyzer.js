import fs from "fs/promises";
import readline from "readline";
import { createReadStream } from "fs";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

async function getInteractionStats(startDate, endDate) {
  const cacheKey = `interactions_${startDate}_${endDate}`;
  const cachedResult = cache.get(cacheKey);
  if (cachedResult) return cachedResult;

  const stats = {
    totalInteractions: 0,
    uniqueUsers: new Set(),
    endpointCounts: {},
    statusCodeCounts: {},
    userActivityTypeCounts: {}, // Added for userActivityType counts
  };

  const fileStream = createReadStream("logs/api-interactions.log");
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    try {
      const log = JSON.parse(line);
      const logDate = new Date(log.timestamp);

      if (logDate >= new Date(startDate) && logDate <= new Date(endDate)) {
        console.log("Processing log:", log);

        stats.totalInteractions++;
        stats.uniqueUsers.add(log.user);

        const endpoint = log.endpoint;
        const statusCode = log.responseStatus;
        const activityType = log.userActivityType;

        // Increment endpoint count
        if (endpoint) {
          stats.endpointCounts[endpoint] =
            (stats.endpointCounts[endpoint] || 0) + 1;
        }

        // Increment status code count
        if (statusCode) {
          stats.statusCodeCounts[statusCode] =
            (stats.statusCodeCounts[statusCode] || 0) + 1;
        }

        // Increment user activity type count
        if (activityType) {
          stats.userActivityTypeCounts[activityType] =
            (stats.userActivityTypeCounts[activityType] || 0) + 1;
        }
      }
    } catch (error) {
      console.error("Error parsing log line:", line, error);
    }
  }

  const result = {
    ...stats,
    uniqueUsers: stats.uniqueUsers.size,
  };

  cache.set(cacheKey, result);
  return result;
}

export { getInteractionStats };
