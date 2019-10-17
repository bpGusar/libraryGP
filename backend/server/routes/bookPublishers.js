import express from "express";

import withAuth from "../middleware";

import BookPublishersContr from "../../DB/controllers/BookPublishers";

const app = express();

app.get("/api/bookPublishers", withAuth, (req, res) => {
  const { howMuch, publishersArr } = req.query;
  if (howMuch === "all") {
    BookPublishersContr.findPublishers(res);
  } else if (howMuch === "some") {
    BookPublishersContr.findPublishers(res, publishersArr);
  }
});

app.post("/api/bookPublishers", withAuth, (req, res) =>
  BookPublishersContr.addOnePublisher(req.body.publisherName, res)
);

export default app;
