import express from "express";

import withAuth from "../../middleware";

import BookLanguagesContr from "../../../DB/controllers/BookLanguages";

const app = express();

app.get("/api/bookLanguages/get", withAuth, (req, res) => {
  const { howMuch, langArr } = req.query;
  if (howMuch === "all") {
    BookLanguagesContr.findBookLanguage(res);
  } else if (howMuch === "some") {
    BookLanguagesContr.findBookLanguage(res, langArr);
  }
});

app.post("/api/bookLanguages/add/one", withAuth, (req, res) => {
  BookLanguagesContr.addOneLang({ languageName: req.body.languageName }, res);
});

export default app;
