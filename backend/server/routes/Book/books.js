import express from "express";

import withAuth from "../../middleware";

import BooksContr from "../../../DB/controllers/Books";

const app = express();

app.post("/api/books/add", withAuth, (req, res) => {
  BooksContr.addBook(req, res);
});

app.post("/api/books/bookABook", withAuth, (req, res) => {
  BooksContr.bookABook(req, res);
});

app.get("/api/books/get", (req, res) => {
  const { howMuch, id, getFullBookInfo } = req.query;
  if (howMuch === "all") {
    BooksContr.findBooks(res, {}, getFullBookInfo);
  } else if (howMuch === "one") {
    BooksContr.findBooks(res, { _id: id }, getFullBookInfo);
  }
});

export default app;
