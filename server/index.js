import httpServer from "./app.js";
import connectDB from "./db/index.js";

const startServer = () => {
  httpServer.listen(process.env.PORT || 8080, () => {
    console.log(`⚙️  Server is  running on port : ${process.env.PORT || 8080}`);
  });
};

try {
  await connectDB();
  startServer();
} catch (error) {
  console.log("Mongo db connect error: ", err);
}
