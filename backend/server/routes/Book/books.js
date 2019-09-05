import express from "express";

import withAuth from "../../middleware";

import BooksContr from "../../../DB/controllers/Books";

const app = express();

app.post("/api/books/add", withAuth, (req, res) => {
  BooksContr.addBook(req, res);
});

app.get("/api/books/get", withAuth, (req, res) => {
  const { howMuch } = req.query;
  if (howMuch === "all") {
    BooksContr.findBooks(res);
  }
});

export default app;
