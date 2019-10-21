import express from "express";

import withAuth from "../middleware";

import OrderedBooksContr from "../../DB/controllers/OrderedBooks";
import OrderedBooksArchiveContr from "../../DB/controllers/OrderedBooksArchive";

const app = express();

app.post("/api/ordered-books", withAuth, (req, res) => {
  OrderedBooksContr.addOrderedBook(req.body, res);
});

app.post("/api/ordered-books/return", withAuth, (req, res) => {
  OrderedBooksArchiveContr.bookReturn(req.body, res);
});

export default app;
