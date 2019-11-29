import _ from "lodash";
import { parallel } from "async";

import MSG from "../../server/config/msgCodes";
import * as config from "../config";

import Authors from "../models/Authors";
import Book from "../models/Book";

function deleteAuthor(res, req) {
  const { id } = req.params;

  parallel(
    {
      Books: cb => Book.countDocuments({ "bookInfo.authors": id }, cb)
    },
    (parErr, result) => {
      if (parErr) {
        res.json(config.getRespData(true, MSG.internalServerErr, parErr));
      } else if (result.Books !== 0) {
        res.json(
          config.getRespData(true, MSG.cantDeleteAuthor, {
            authorBusy: true,
            result
          })
        );
      } else {
        Authors.deleteOne({ _id: id }, err => {
          if (err) {
            res.json(config.getRespData(true, MSG.cantDeleteAuthor, err));
          } else {
            res.json(config.getRespData(false, MSG.authorWasDeleted));
          }
        });
      }
    }
  );
}

function updateAuthor(req, res) {
  const updateData = req.body;
  const { id } = req.params;

  Authors.updateOne(
    { _id: id },
    { ...updateData },
    { runValidators: true, context: "query" },
    err => {
      if (err) {
        res.json(config.getRespData(true, MSG.authorUpdateError, err));
      } else {
        res.send(config.getRespData(false));
      }
    }
  );
}

function addOneAuthor(req, res) {
  const data = req.body;
  const author = new Authors({
    ...data,
    addedByUser: req.middlewareUserInfo._id
  });
  author.save((err, newAuthor) => {
    if (err) {
      if (err.code === 11000) {
        res.json(config.getRespData(true, MSG.authorMustBeUnique, err));
      } else {
        res.json(config.getRespData(true, MSG.cantAddAuthor, err));
      }
    } else {
      res.send(config.getRespData(false, null, newAuthor));
    }
  });
}

/**
 * Возвращает массив авторов
 * @param res {Object} Response
 */
function findAuthors(res, req, data = {}) {
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

  Authors.countDocuments(
    _.isEmpty(data) ? {} : JSON.parse(data),
    (countError, count) => {
      res.set({
        "max-elements": count,
        ...options
      });
      Authors.find(_.isEmpty(data) ? {} : JSON.parse(data))
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

export default {
  addOneAuthor,
  findAuthors,
  deleteAuthor,
  updateAuthor
};
