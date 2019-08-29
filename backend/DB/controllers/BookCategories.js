/* eslint-disable import/prefer-default-export */
import Mongoose from "mongoose";

import { MSG } from "../../../config/msgCodes";
import { getRespData } from "../config";

import "../models/BookCategories";

const BookCategories = Mongoose.model("BookCategories");

export function setNewCategory(catName, res) {
  const category = new BookCategories({ categoryName: catName });
  category.save(err => {
    if (err) {
      res.res.json(getRespData(true, MSG.cantAddNewBookCategory, err));
    } else {
      res.send(getRespData(false));
    }
  });
}
