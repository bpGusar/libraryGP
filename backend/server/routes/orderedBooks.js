import express from "express";

import withAuth from "../middleware";

import OrderedBooksContr from "../../DB/controllers/OrderedBooks";
import OrderedBooksArchiveContr from "../../DB/controllers/OrderedBooksArchive";

const app = express();

app.post(
  "/api/ordered-books",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => {
    OrderedBooksContr.addOrderedBook(req, res);
  }
);

app.get(
  "/api/ordered-books",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => {
    const { getQuery } = req.query;

    OrderedBooksContr.findOrderedBooks(res, getQuery);
  }
);

app.post(
  "/api/ordered-books/return",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => {
    OrderedBooksArchiveContr.bookReturn(req, res);
  }
);

export default app;
