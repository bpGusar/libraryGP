import express from "express";

import withAuth from "../middleware";

import BookCategoriesContr from "../../DB/controllers/BookCategories";

const app = express();

app.get("/api/book-categories/", (req, res) => {
  const { searchQuery } = req.query;
  BookCategoriesContr.findCategories(res, req, searchQuery);
});

app.delete(
  "/api/book-categories/:id",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => BookCategoriesContr.deleteCategory(res, req)
);

app.put(
  "/api/book-categories/:id",
  (req, res, next) => withAuth(req, res, next),
  (req, res) => BookCategoriesContr.updateCategory(req, res)
);

app.post(
  "/api/book-categories",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => BookCategoriesContr.addOneCategory(req, res)
);

app.get("/api/book-categories/byname/:categoryName", (req, res) => {
  const { categoryName } = req.params;
  BookCategoriesContr.findCategories(
    res,
    req,
    JSON.stringify({ categoryName })
  );
});

export default app;
