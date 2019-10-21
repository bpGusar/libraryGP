import express from "express";

import withAuth from "../middleware";

import BookedBooksContr from "../../DB/controllers/BookedBooks";
import BookedBooksArchiveContr from "../../DB/controllers/BookedBooksArchive";

const app = express();

app.post("/api/booked-books/", withAuth, (req, res) => {
  BookedBooksContr.bookABook(req, res);
});

/**
 * Роут для получения информации по забронированным книгам.
 * Принимает request query
 * @param {Object} req.query.getQuery Определяет по каким параметрам искать книги.
 */
app.get("/api/booked-books", withAuth, (req, res) => {
  const { getQuery } = req.query;

  BookedBooksContr.findBookedBooks(res, getQuery);
});

app.post("/api/booked-books/reject-ordering", withAuth, (req, res) => {
  BookedBooksArchiveContr.rejectOrdering(req.body, res);
});

export default app;
