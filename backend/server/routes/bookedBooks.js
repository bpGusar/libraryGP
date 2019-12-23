import express from "express";

import withAuth from "../middleware";

import BookedBooksContr from "../../DB/controllers/BookedBooks";
import BookedBooksArchiveContr from "../../DB/controllers/BookedBooksArchive";

const app = express();

app.post("/api/booked-books/", withAuth, (req, res) =>
  BookedBooksContr.bookABook(req, res)
);

app.get(
  "/api/booked-books",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => {
    const { getQuery } = req.query;
    BookedBooksContr.findBookedBooks(res, getQuery);
  }
);

app.get(
  "/api/booked-books/count",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => BookedBooksContr.getBookedBooksCount(res)
);

app.post(
  "/api/booked-books/:id/cancel-reservation",
  (req, res, next) => withAuth(req, res, next),
  (req, res) => BookedBooksArchiveContr.rejectOrdering(req, res)
);

app.get(
  "/api/booked-books/archive",
  (req, res, next) => withAuth(req, res, next),
  (req, res) => {
    const { searchQuery } = req.query;
    BookedBooksArchiveContr.findBooks(req, res, searchQuery, true);
  }
);

export default app;
