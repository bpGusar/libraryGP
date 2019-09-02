import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
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
app.use(fileUpload());
app.use(cors(corsOptions));

app.use("/posters", express.static(`${__dirname}/files/posters`));

Object.keys(routes).map(route => app.use(routes[route]));

app.listen(process.env.BACK_PORT, () => {
  console.log(`Server is up and running on port ${process.env.BACK_PORT}`);
});
