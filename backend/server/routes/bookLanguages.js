import express from "express";

import withAuth from "../middleware";

import BookLanguagesContr from "../../DB/controllers/BookLanguages";

const app = express();

app.get("/api/book-languages", withAuth, (req, res) =>
  BookLanguagesContr.findBookLanguage(res)
);

app.post("/api/book-languages", withAuth, (req, res) =>
  BookLanguagesContr.addOneLang(req.body, res)
);

export default app;
