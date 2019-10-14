import express from "express";

import withAuth from "../middleware";

import OrderedBooksContr from "../../DB/controllers/OrderedBooks";

const app = express();

app.post("/api/orderedBooks/add", withAuth, (req, res) => {
  OrderedBooksContr.addOrderedBook(req.body, res);
});

export default app;
