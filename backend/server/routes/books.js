import express from "express";

import withAuth from "../middleware";

import BooksContr from "../../DB/controllers/Books";

const app = express();

app.post(
  "/api/books",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => BooksContr.addBook(req, res)
);

app.put(
  "/api/books",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => BooksContr.updateBook(req, res)
);

app.get("/api/books", (req, res) => {
  const { searchQuery } = req.query;
  BooksContr.findBooks(res, req, searchQuery);
});

app.get("/api/books/:id", (req, res) =>
  BooksContr.findBooks(res, req, JSON.stringify({ _id: req.params.id }))
);

app.delete(
  "/api/books/:id",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => BooksContr.deleteBook(res, req)
);

app.get("/api/books/:id/availability", withAuth, (req, res) =>
  BooksContr.thisBookOrderedOrBooked(res, req)
);

export default app;
