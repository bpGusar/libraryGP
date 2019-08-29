import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import * as config from "../DB/config";

import * as routes from "./routes/routesPaths";

const app = express();
const corsOptions = {
  origin: process.env.CORS_LINK,
  credentials: true
};

config.setUpConnection();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));

Object.keys(routes).map(route => app.use(routes[route]));

app.listen(process.env.BACK_PORT, () => {
  console.log(`Server is up and running on port ${process.env.BACK_PORT}`);
});
