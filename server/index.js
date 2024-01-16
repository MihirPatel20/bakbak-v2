import httpServer from "./app.js";

const startServer = () => {
  httpServer.listen(8080, () => {
    console.log(`⚙️  Server is  running on port 8080`);
  });
};

startServer();
