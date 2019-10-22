import express from "express";

import withAuth from "../middleware";

import BookLanguagesContr from "../../DB/controllers/BookLanguages";

const app = express();

app.get("/api/book-languages", (req, res) =>
  BookLanguagesContr.findBookLanguage(res)
);

app.post(
  "/api/book-languages",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => BookLanguagesContr.addOneLang(req.body, res)
);

export default app;
