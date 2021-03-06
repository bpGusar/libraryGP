import express from "express";

import withAuth from "../middleware";

import BookAuthorsContr from "../../DB/controllers/BookAuthors";

const app = express();

app.post(
  "/api/book-authors",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => BookAuthorsContr.addOneAuthor(req, res)
);

app.delete(
  "/api/book-authors/:id",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => BookAuthorsContr.deleteAuthor(res, req)
);

app.put(
  "/api/book-authors/:id",
  (req, res, next) => withAuth(req, res, next),
  (req, res) => BookAuthorsContr.updateAuthor(req, res)
);

app.get("/api/book-authors", (req, res) => {
  const { searchQuery } = req.query;
  BookAuthorsContr.findAuthors(res, req, searchQuery);
});

app.get("/api/book-authors/byid/:id", (req, res) => {
  const { id } = req.params;
  BookAuthorsContr.findAuthors(res, req, JSON.stringify({ _id: id }));
});

app.get("/api/book-authors/byname/:authorName", (req, res) => {
  const { authorName } = req.params;
  BookAuthorsContr.findAuthors(res, req, JSON.stringify({ authorName }));
});

export default app;
