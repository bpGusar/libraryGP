import express from "express";

import withAuth from "../../middleware";

import * as config from "../../../DB/config";
import { MSG } from "../../../../config/msgCodes";

import BookCategories from "../../../DB/models/BookCategories";

const app = express();

app.get("/api/bookCategories/getAll/", withAuth, (req, res) => {
  BookCategories.find({}, (err, categories) => {
    if (err) {
      res.json(config.getRespData(true, MSG.internalErr500, err));
    } else {
      res.json(config.getRespData(false, null, categories));
    }
  });
});

app.post("/api/bookCategories/addOne/", withAuth, (req, res) => {
  const category = new BookCategories({ categoryName: req.body.categoryName });
  category.save(err => {
    if (err) {
      res.res.json(config.getRespData(true, MSG.cantAddNewBookCategory, err));
    } else {
      res.send(config.getRespData(false));
    }
  });
});

app.post("/api/bookCategories/findOne/", withAuth, (req, res) => {
  BookCategories.findOne(
    { categoryName: req.body.categoryName },
    (err, category) => {
      if (err) {
        res.json(config.getRespData(true, MSG.internalErr500, err));
      } else if (!category) {
        res.json(
          config.getRespData(true, MSG.cantFindAuthor, {
            categoryName: req.body.categoryName
          })
        );
      } else {
        res.json(config.getRespData(false, null, category));
      }
    }
  );
});

export default app;
