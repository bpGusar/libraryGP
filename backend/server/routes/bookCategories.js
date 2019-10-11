import express from "express";

import withAuth from "../middleware";

import BookCategoriesContr from "../../DB/controllers/BookCategories";

const app = express();

app.get("/api/bookCategories/get", withAuth, (req, res) => {
  const { howMuch, categoriesArr } = req.query;
  if (howMuch === "all") {
    BookCategoriesContr.findCategories(res);
  } else if (howMuch === "some") {
    BookCategoriesContr.findCategories(res, categoriesArr);
  }
});

app.post("/api/bookCategories/add/one", withAuth, (req, res) => {
  BookCategoriesContr.addOneCategory(req.body.categoryName, res);
});

export default app;
