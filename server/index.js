import httpServer from "./app.js";
import connectDB from "./db/index.js";

const startServer = () => {
  const PORT = process.env.PORT || 8080;

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`⚙️ Server running on port ${PORT}`);
  });
};

try {
  await connectDB();
  startServer();
} catch (error) {
  console.log("Mongo db connect error:", error);
}
