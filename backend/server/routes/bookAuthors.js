import express from "express";

import withAuth from "../middleware";

import BookAuthorsContr from "../../DB/controllers/BookAuthors";

const app = express();

app.post("/api/authors", withAuth, (req, res) =>
  BookAuthorsContr.addOneAuthor(req.body, res)
);

app.get("/api/authors", (req, res) => {
  BookAuthorsContr.findAuthors(res);
});

export default app;
