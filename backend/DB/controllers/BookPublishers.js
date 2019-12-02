import _ from "lodash";
import { parallel } from "async";

import MSG from "../../server/config/msgCodes";
import * as config from "../config";

import BookPublishers from "../models/BookPublishers";
import Book from "../models/Book";

function findPublishers(res, req, data = {}) {
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

  BookPublishers.countDocuments(
    _.isEmpty(data) ? {} : JSON.parse(data),
    (countError, count) => {
      res.set({
        "max-elements": count,
        ...options
      });
      BookPublishers.find(_.isEmpty(data) ? {} : JSON.parse(data))
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

function addOnePublisher(req, res) {
  const data = req.body;
  const publisher = new BookPublishers({
    ...data,
    addedByUser: req.middlewareUserInfo._id
  });
  publisher.save((err, newPub) => {
    if (err) {
      if (err.code === 11000) {
        res.json(config.getRespData(true, MSG.publisherMustBeUnique, err));
      } else {
        res.json(config.getRespData(true, MSG.cantAddNewBookCategory, err));
      }
    } else {
      res.send(config.getRespData(false, null, newPub));
    }
  });
}

function updatePublisher(req, res) {
  const updateData = req.body;
  const { id } = req.params;

  BookPublishers.updateOne(
    { _id: id },
    { ...updateData },
    { runValidators: true, context: "query" },
    err => {
      if (err) {
        res.json(config.getRespData(true, MSG.publisherUpdateError, err));
      } else {
        res.send(config.getRespData(false));
      }
    }
  );
}

function deletePublisher(res, req) {
  const { id } = req.params;

  parallel(
    {
      Books: cb => Book.countDocuments({ "bookInfo.publisher": id }, cb)
    },
    (parErr, result) => {
      if (parErr) {
        res.json(config.getRespData(true, MSG.internalServerErr, parErr));
      } else if (result.Books !== 0) {
        res.json(
          config.getRespData(true, MSG.cantDeletePublisher, {
            authorBusy: true,
            result
          })
        );
      } else {
        BookPublishers.deleteOne({ _id: id }, err => {
          if (err) {
            res.json(config.getRespData(true, MSG.cantDeletePublisher, err));
          } else {
            res.json(config.getRespData(false, MSG.publisherWasDeleted));
          }
        });
      }
    }
  );
}

export default {
  findPublishers,
  addOnePublisher,
  updatePublisher,
  deletePublisher
};
