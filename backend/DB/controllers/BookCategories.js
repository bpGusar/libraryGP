import _ from "lodash";
import { parallel } from "async";

import MSG from "../../server/config/msgCodes";
import * as config from "../config";

import BookCategories from "../models/BookCategories";
import Book from "../models/Book";

function findCategories(res, req, data = {}) {
  let { options } = req.query;

  if (_.isUndefined(options)) {
    options = {
      page: 1,
      limit: 99,
      sort: "desc"
    };
  } else {
    options = JSON.parse(options);
  }

  options.page = _.isUndefined(options.page) ? 1 : options.page;
  options.sort = _.isUndefined(options.sort) ? 1 : options.sort;
  options.limit = _.isUndefined(options.limit) ? 99 : options.limit;

  const getSkip = () => {
    if (options.page === 1) {
      return 0;
    }
    return options.limit * (options.page - 1);
  };

  BookCategories.countDocuments(
    _.isEmpty(data) ? {} : JSON.parse(data),
    (countError, count) => {
      res.set({
        "max-elements": count,
        ...options
      });
      BookCategories.find(_.isEmpty(data) ? {} : JSON.parse(data))
        .sort({ createdAt: options.sort })
        .skip(getSkip())
        .limit(options.limit)
        .exec((err, cats) => {
          if (err) {
            res.json(config.getRespData(true, MSG.internalServerErr, err));
          } else {
            res.json(config.getRespData(false, null, cats));
          }
        });
    }
  );
}

function deleteCategory(res, req) {
  const { id } = req.params;

  parallel(
    {
      Books: cb => Book.countDocuments({ "bookInfo.categories": id }, cb)
    },
    (parErr, result) => {
      if (parErr) {
        res.json(config.getRespData(true, MSG.internalServerErr, parErr));
      } else if (result.Books !== 0) {
        res.json(
          config.getRespData(true, MSG.cantDeleteCategory, {
            authorBusy: true,
            result
          })
        );
      } else {
        BookCategories.deleteOne({ _id: id }, err => {
          if (err) {
            res.json(config.getRespData(true, MSG.cantDeleteCategory, err));
          } else {
            res.json(config.getRespData(false, MSG.categoryWasDeleted));
          }
        });
      }
    }
  );
}

function updateCategory(req, res) {
  const updateData = req.body;
  const { id } = req.params;

  BookCategories.updateOne(
    { _id: id },
    { ...updateData },
    { runValidators: true, context: "query" },
    err => {
      if (err) {
        res.json(config.getRespData(true, MSG.categoryUpdateError, err));
      } else {
        res.send(config.getRespData(false));
      }
    }
  );
}

function addOneCategory(req, res) {
  const data = req.body;
  const category = new BookCategories({
    ...data,
    addedByUser: req.middlewareUserInfo._id
  });
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

export default {
  findCategories,
  updateCategory,
  addOneCategory,
  deleteCategory
};
