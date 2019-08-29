import express from "express";

import withAuth from "../middleware";

import * as config from "../../DB/config";
import { MSG } from "../../../config/msgCodes";

import BookCategories from "../../DB/models/BookCategories";

import BookCategoriesContr from "../../DB/controllers/BookCategories";

const app = express();

app.get("/api/getBookCategories/", withAuth, (req, res) => {
  BookCategories.find({}, (err, categories) => {
    console.log({ err, categories });
    if (err) {
      res.json(config.getRespData(true, MSG.internalErr500, err));
    } else {
      res.json(config.getRespData(false, null, categories));
    }
  });
});

app.post("/api/addNewBookCategory/", withAuth, (req, res) => {
  BookCategoriesContr.setNewCategory(req.body.categoryName, res);
});

export default app;
