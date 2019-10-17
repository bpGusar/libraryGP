import express from "express";

import withAuth from "../middleware";

import BooksContr from "../../DB/controllers/Books";
import BookedBooksArchiveContr from "../../DB/controllers/BookedBooksArchive";
import OrderedBooksArchiveContr from "../../DB/controllers/OrderedBooksArchive";

const app = express();

app.post("/api/books", withAuth, (req, res) => {
  BooksContr.addBook(req, res);
});

app.get("/api/books", (req, res) => {
  const { getFullBookInfo, booksQuery } = req.query;

  BooksContr.findBooks(res, booksQuery, getFullBookInfo);
});

app.get("/api/books/orderStatus", withAuth, (req, res) => {
  const { booksQuery } = req.query;

  BooksContr.thisBookOrderedOrBooked(res, booksQuery);
});

app.post(
  "/api/books/bookedBooksArchive/rejectOrdering",
  withAuth,
  (req, res) => {
    BookedBooksArchiveContr.rejectOrdering(req.body, res);
  }
);

app.post("/api/books/orderedBooksArchive/bookReturn", withAuth, (req, res) => {
  OrderedBooksArchiveContr.bookReturn(req.body, res);
});

export default app;
