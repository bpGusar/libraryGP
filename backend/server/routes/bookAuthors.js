import express from "express";

import withAuth from "../middleware";

import BookAuthorsContr from "../../DB/controllers/BookAuthors";

const app = express();

app.post("/api/authors", withAuth, (req, res) => {
  BookAuthorsContr.addOneAuthor({ authorName: req.body.authorName }, res);
});

app.get("/api/authors", (req, res) => {
  const { howMuch, authorsArr } = req.query;
  if (howMuch === "all") {
    BookAuthorsContr.findAuthors(res);
  } else if (howMuch === "some") {
    BookAuthorsContr.findAuthors(res, authorsArr);
  }
});

export default app;
