import express from "express";

import withAuth from "../middleware";

import BookCategoriesContr from "../../DB/controllers/BookCategories";

const app = express();

app.get("/api/bookCategories/", withAuth, (req, res) =>
  BookCategoriesContr.findCategories(res)
);

app.post("/api/bookCategories/", withAuth, (req, res) => {
  BookCategoriesContr.addOneCategory(req.body, res);
});

export default app;
