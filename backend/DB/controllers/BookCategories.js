import _ from "lodash";

import MSG from "../../server/config/msgCodes";
import * as config from "../config";

import BookCategories from "../models/BookCategories";

function findCategories(res, data = {}) {
  BookCategories.find(
    _.isEmpty(data) ? {} : JSON.parse(data),
    (err, categories) => {
      if (err) {
        res.json(config.getRespData(true, MSG.internalServerErr, err));
      } else {
        res.json(config.getRespData(false, null, categories));
      }
    }
  );
}

function addOneCategory(categoryName, res) {
  const category = new BookCategories({ categoryName });
  category.save(err => {
    if (err) {
      if (err.code === 11000) {
        res.json(config.getRespData(true, MSG.categoryNameMustBeUnique, err));
      } else {
        res.json(config.getRespData(true, MSG.cantAddNewBookCategory, err));
      }
    } else {
      res.send(config.getRespData(false));
    }
  });
}

export default { findCategories, addOneCategory };
