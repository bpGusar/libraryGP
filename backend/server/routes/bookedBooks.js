import express from "express";

import withAuth from "../middleware";

import BookedBooksContr from "../../DB/controllers/BookedBooks";
import BookedBooksArchiveContr from "../../DB/controllers/BookedBooksArchive";

const app = express();

app.post("/api/booked-books/", withAuth, (req, res) => {
  BookedBooksContr.bookABook(req, res);
});

app.get(
  "/api/booked-books",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => {
    const { getQuery } = req.query;

    BookedBooksContr.findBookedBooks(res, getQuery);
  }
);

app.post(
  "/api/booked-books/reject-ordering",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => {
    BookedBooksArchiveContr.rejectOrdering(req.body, res);
  }
);

export default app;
