import express from "express";

import withAuth from "../middleware";

import BlogContr from "../../DB/controllers/Blog";

const app = express();

app.post(
  "/api/blog",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => BlogContr.addPost(req, res)
);

app.put(
  "/api/blog",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => BlogContr.updatePost(req, res)
);

app.get("/api/blog", (req, res) => {
  const { searchQuery } = req.query;
  BlogContr.getPosts(req, res, searchQuery);
});

app.get("/api/blog/:id", (req, res) =>
  BlogContr.getPosts(req, res, JSON.stringify({ _id: req.params.id }))
);

app.delete(
  "/api/blog/:id",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => BlogContr.deletePost(res, req)
);

app.put(
  "/api/blog/:id/restore",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => BlogContr.restorePost(res, req)
);

app.post(
  "/api/blog/upload/imageByFile",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => BlogContr.uploadImageByFile(req, res)
);

app.post(
  "/api/blog/upload/imageByUrl",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => BlogContr.uploadImageByURL(req, res)
);

export default app;
