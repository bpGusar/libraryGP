import express from "express";

import withAuth from "../middleware";

import BookPublishersContr from "../../DB/controllers/BookPublishers";

const app = express();

app.get("/api/book-publishers", (req, res) =>
  BookPublishersContr.findPublishers(res)
);

app.post(
  "/api/book-publishers",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => BookPublishersContr.addOnePublisher(req.body, res)
);

app.get("/api/book-publishers/byname/:publisherName", (req, res) => {
  const { publisherName } = req.params;
  BookPublishersContr.findPublishers(res, JSON.stringify({ publisherName }));
});

export default app;
