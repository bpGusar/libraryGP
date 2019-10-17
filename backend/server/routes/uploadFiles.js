/* eslint-disable consistent-return */
import express from "express";

import withAuth from "../middleware";

const app = express();

app.post("/api/upload", withAuth, () => {
  console.log("test");
});

export default app;
