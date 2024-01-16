import express from "express";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default httpServer;
