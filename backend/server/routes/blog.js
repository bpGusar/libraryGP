import express from "express";

import withAuth from "../middleware";

import BlogContr from "../../DB/controllers/Blog";

const app = express();

app.post(
  "/api/blog",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => BlogContr.addPost(req, res)
);

app.get("/api/blog", (req, res) => BlogContr.getPosts(req, res));

export default app;
