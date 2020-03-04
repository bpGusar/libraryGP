import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import "dotenv/config";
import cron from "node-cron";
import http from "http";
import socket from "socket.io";

import * as dbConfig from "../DB/config";
import cronFunctions from "../config/cron";
import staticUrls from "../config/staticUrl";
import generateRoutes from "./routes/routesGenerator";

const app = express();
const server = http.createServer(app);
const io = socket.listen(server);

const socketConnections = [];

/** server starter */
server.listen(process.env.BACK_PORT, () => {
  console.log(`Server is up and running on port ${process.env.BACK_PORT}`);
});

io.sockets.on("connection", socketArg => {
  console.log("Успешное соединение");
  socketConnections.push(socketArg);

  socketArg.on("disconnect", () => {
    socketConnections.splice(socketConnections.indexOf(socketArg), 1);
    console.log("Успешное отсоединение");
  });
});

const corsOptions = {
  origin: process.env.CORS_LINK,
  credentials: true
};

/** connect to DB */
dbConfig.setUpConnection();

/** server setup */
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(fileUpload());
app.use(cors(corsOptions));
app.use((req, res, next) => {
  req.io = io;
  next();
});

/** cron tasks builder */
Object.keys(cronFunctions).forEach(task =>
  cron.schedule(
    cronFunctions[task].cron.time,
    cronFunctions[task].cron.function,
    {
      scheduled: true,
      timezone: "Europe/Moscow"
    }
  )
);

/** static url's to folders builder */
Object.keys(staticUrls).forEach(prop =>
  app.use(staticUrls[prop].url, express.static(staticUrls[prop].pathToFolder))
);

/** routes builder */
generateRoutes(app);
