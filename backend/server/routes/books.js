import express from "express";

import withAuth from "../middleware";

import BooksContr from "../../DB/controllers/Books";

const app = express();

app.post("/api/books/add", withAuth, (req, res) => {
  BooksContr.addBook(req, res);
});

app.get("/api/books/get", (req, res) => {
  const { getFullBookInfo, booksQuery } = req.query;

  BooksContr.findBooks(res, booksQuery, getFullBookInfo);
});

app.get("/api/books/thisBookOrderedOrBooked", withAuth, (req, res) => {
  const { booksQuery } = req.query;

  BooksContr.thisBookOrderedOrBooked(res, booksQuery);
});

export default app;
