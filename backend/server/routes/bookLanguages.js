import express from "express";

import withAuth from "../middleware";

import BookLanguagesContr from "../../DB/controllers/BookLanguages";

const app = express();

app.get("/api/book-languages", (req, res) => {
  const { searchQuery } = req.query;
  BookLanguagesContr.findLang(res, req, searchQuery);
});

app.post(
  "/api/book-languages",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => BookLanguagesContr.addOneLang(req, res)
);

app.delete(
  "/api/book-languages/:id",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => BookLanguagesContr.deleteLang(res, req)
);

app.put(
  "/api/book-languages/:id",
  (req, res, next) => withAuth(req, res, next),
  (req, res) => BookLanguagesContr.updateLang(req, res)
);

app.get("/api/book-languages/bycode/:langCode", (req, res) => {
  const { langCode } = req.params;
  BookLanguagesContr.findLang(res, req, JSON.stringify({ langCode }));
});

export default app;
