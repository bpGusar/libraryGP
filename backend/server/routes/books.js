import express from "express";

import withAuth from "../middleware";

import BooksContr from "../../DB/controllers/Books";

const app = express();

app.post("/api/books", withAuth, (req, res) => {
  BooksContr.addBook(req, res);
});

app.get("/api/books/:id", (req, res) => {
  const { fetch_type } = req.query;

  BooksContr.findBooks(res, req.params, fetch_type);
});

app.get("/api/books", (req, res) => {
  const { fetch_type } = req.query;

  BooksContr.findBooks(res, {}, fetch_type);
});

app.get("/api/books/:id/availability", withAuth, (req, res) => {
  BooksContr.thisBookOrderedOrBooked(res, req);
});

export default app;
