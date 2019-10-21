import express from "express";

import withAuth from "../middleware";

import BookedBooksContr from "../../DB/controllers/BookedBooks";
import BookedBooksArchiveContr from "../../DB/controllers/BookedBooksArchive";

const app = express();

app.post("/api/booked-books/", withAuth, (req, res) => {
  BookedBooksContr.bookABook(req, res);
});

app.get("/api/booked-books", withAuth, (req, res) => {
  const { getQuery } = req.query;

  BookedBooksContr.findBookedBooks(res, getQuery);
});

app.post("/api/booked-books/reject-ordering", withAuth, (req, res) => {
  BookedBooksArchiveContr.rejectOrdering(req.body, res);
});

export default app;
