import _ from "lodash";

import MSG from "../../server/config/msgCodes";
import * as config from "../config";

import BookCategories from "../models/BookCategories";

function findCategories(res, query = {}) {
  BookCategories.find(
    _.isEmpty(query) ? {} : JSON.parse(query),
    (err, categories) => {
      if (err) {
        res.json(config.getRespData(true, MSG.internalServerErr, err));
      } else {
        res.json(config.getRespData(false, null, categories));
      }
    }
  );
}

function addOneCategory(data, res) {
  const category = new BookCategories({ ...data });
  category.save((err, newCat) => {
    if (err) {
      if (err.code === 11000) {
        res.json(config.getRespData(true, MSG.categoryNameMustBeUnique, err));
      } else {
        res.json(config.getRespData(true, MSG.cantAddNewBookCategory, err));
      }
    } else {
      res.send(config.getRespData(false, null, newCat));
    }
  });
}

export default { findCategories, addOneCategory };
