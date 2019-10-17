import express from "express";

import withAuth from "../middleware";

import BookedBooksContr from "../../DB/controllers/BookedBooks";

const app = express();

app.post("/api/bookedBooks/", withAuth, (req, res) => {
  BookedBooksContr.bookABook(req, res);
});

/**
 * Роут для получения информации по забронированным книгам.
 * Принимает request query
 * @param {Object} req.query.getQuery Определяет по каким параметрам искать книги.
 */
app.get("/api/bookedBooks", withAuth, (req, res) => {
  const { getQuery } = req.query;

  BookedBooksContr.findBookedBooks(res, getQuery);
});

export default app;
