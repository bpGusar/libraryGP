/* eslint-disable consistent-return */
import express from "express";

import withAuth from "../middleware";

const app = express();

app.post(
  "/api/upload",
  (req, res, next) => withAuth(req, res, next, [1]),
  () => {
    console.log("test");
  }
);

export default app;
