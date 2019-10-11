import express from "express";

import withAuth from "../middleware";

import BookedBooksContr from "../../DB/controllers/BookedBooks";

const app = express();

app.post("/api/bookedBooks/add/one", withAuth, (req, res) => {
  BookedBooksContr.bookABook(req, res);
});

app.get("/api/bookedBooks/get", withAuth, (req, res) => {
  const { howMuch, getQuery } = req.query;

  if (howMuch === "one") {
    BookedBooksContr.findBookedBooks(res, getQuery);
  }
});

export default app;
