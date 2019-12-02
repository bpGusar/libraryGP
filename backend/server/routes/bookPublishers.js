import express from "express";

import withAuth from "../middleware";

import BookPublishersContr from "../../DB/controllers/BookPublishers";

const app = express();

app.get("/api/book-publishers", (req, res) => {
  const { searchQuery } = req.query;
  BookPublishersContr.findPublishers(res, req, searchQuery);
});

app.post(
  "/api/book-publishers",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => BookPublishersContr.addOnePublisher(req, res)
);

app.delete(
  "/api/book-publishers/:id",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => BookPublishersContr.deletePublisher(res, req)
);

app.put(
  "/api/book-publishers/:id",
  (req, res, next) => withAuth(req, res, next),
  (req, res) => BookPublishersContr.updatePublisher(req, res)
);

app.get("/api/book-publishers/byname/:publisherName", (req, res) => {
  const { publisherName } = req.params;
  BookPublishersContr.findPublishers(
    res,
    req,
    JSON.stringify({ publisherName })
  );
});

export default app;
