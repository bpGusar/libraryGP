import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import "dotenv/config";
import cron from "node-cron";

import * as dbConfig from "../DB/config";
import * as routes from "./routes/routesPaths";
import cronFunctions from "./config/cron";
import staticUrls from "./config/staticUrl";

const app = express();

const corsOptions = {
  origin: process.env.CORS_LINK,
  credentials: true
};

/** connect to DB */
dbConfig.setUpConnection();

/** server setup */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(fileUpload());
app.use(cors(corsOptions));

/** cron tasks builder */
Object.keys(cronFunctions).forEach(task =>
  cron.schedule(cronFunctions[task].time, cronFunctions[task].function, {
    scheduled: true,
    timezone: "Europe/Moscow"
  })
);

/** static url's to folders builder */
Object.keys(staticUrls).forEach(prop =>
  app.use(staticUrls[prop].url, express.static(staticUrls[prop].pathToFolder))
);

/** routes builder */
Object.keys(routes).forEach(route => app.use(routes[route]));

/** server starter */
app.listen(process.env.BACK_PORT, () => {
  console.log(`Server is up and running on port ${process.env.BACK_PORT}`);
});
