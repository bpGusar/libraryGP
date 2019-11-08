import express from "express";

import withAuth from "../middleware";

import BookAuthorsContr from "../../DB/controllers/BookAuthors";

const app = express();

app.post(
  "/api/book-authors",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => BookAuthorsContr.addOneAuthor(req.body, res)
);

app.get("/api/book-authors", (req, res) => {
  BookAuthorsContr.findAuthors(res);
});

app.get("/api/book-authors/byid/:id", (req, res) => {
  const { id } = req.params;
  BookAuthorsContr.findAuthors(res, JSON.stringify({ _id: id }));
});

app.get("/api/book-authors/byname/:authorName", (req, res) => {
  const { authorName } = req.params;
  BookAuthorsContr.findAuthors(res, JSON.stringify({ authorName }));
});

export default app;
