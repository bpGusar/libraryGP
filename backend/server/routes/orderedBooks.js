import express from "express";

import withAuth from "../middleware";

import OrderedBooksContr from "../../DB/controllers/OrderedBooks";
import OrderedBooksArchiveContr from "../../DB/controllers/OrderedBooksArchive";

const app = express();

app.post("/api/orderedBooks", withAuth, (req, res) => {
  OrderedBooksContr.addOrderedBook(req.body, res);
});

app.post("/api/books/orderedBooksArchive/bookReturn", withAuth, (req, res) => {
  OrderedBooksArchiveContr.bookReturn(req.body, res);
});

export default app;
