import _ from "lodash";
import { parallel } from "async";

import MSG from "../../config/msgCodes";
import * as config from "../config";

import BookLanguages from "../models/BookLanguages";
import Book from "../models/Book";

function deleteLang(res, req) {
  const { id } = req.params;

  parallel(
    {
      Books: cb => Book.countDocuments({ "bookInfo.languages": id }, cb)
    },
    (parErr, result) => {
      if (parErr) {
        res.json(config.getRespData(true, MSG.internalServerErr, parErr));
      } else if (result.Books !== 0) {
        res.json(
          config.getRespData(true, MSG.cantDeleteLang, {
            authorBusy: true,
            result
          })
        );
      } else {
        BookLanguages.deleteOne({ _id: id }, err => {
          if (err) {
            res.json(config.getRespData(true, MSG.cantDeleteLang, err));
          } else {
            res.json(config.getRespData(false, MSG.langWasDeleted));
          }
        });
      }
    }
  );
}

function updateLang(req, res) {
  const updateData = req.body;
  const { id } = req.params;

  BookLanguages.updateOne(
    { _id: id },
    { ...updateData },
    { runValidators: true, context: "query" },
    err => {
      if (err) {
        res.json(config.getRespData(true, MSG.langUpdateError, err));
      } else {
        res.send(config.getRespData(false));
      }
    }
  );
}

function addOneLang(req, res) {
  const data = req.body;
  const author = new BookLanguages({
    ...data,
    addedByUser: req.middlewareUserInfo._id
  });
  author.save((err, newLang) => {
    if (err) {
      if (err.code === 11000) {
        res.json(config.getRespData(true, MSG.langMustBeUnique, err));
      } else {
        res.json(config.getRespData(true, MSG.cantAddNewBookLanguage, err));
      }
    } else {
      res.send(config.getRespData(false, null, newLang));
    }
  });
}

function findLang(res, req, data = {}) {
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

  BookLanguages.countDocuments(
    _.isEmpty(data) ? {} : JSON.parse(data),
    (countError, count) => {
      res.set({
        "max-elements": count,
        ...options
      });
      BookLanguages.find(_.isEmpty(data) ? {} : JSON.parse(data))
        .sort({ createdAt: options.sort })
        .skip(getSkip())
        .limit(options.limit)
        .exec((err, books) => {
          if (err) {
            res.json(config.getRespData(true, MSG.internalServerErr, err));
          } else {
            res.json(config.getRespData(false, null, books));
          }
        });
    }
  );
}

export default { updateLang, addOneLang, deleteLang, findLang };
