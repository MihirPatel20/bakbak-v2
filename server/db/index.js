import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

/** @type {typeof mongoose | undefined} */
export let dbInstance = undefined;

const mongoDbConnectionUri =
  process.env.NODE_ENV === "production"
    ? process.env.MONGODB_URI
    : "mongodb://localhost:27017";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${mongoDbConnectionUri}/${DB_NAME}`
    );
    dbInstance = connectionInstance;
    console.log(
      `\n☘️  MongoDB Connected! Db host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection error: ", error);
    process.exit(1);
  }
};

export default connectDB;
