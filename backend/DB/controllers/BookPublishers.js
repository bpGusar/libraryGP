import _ from "lodash";

import MSG from "../../server/config/msgCodes";
import * as config from "../config";

import BookPublishers from "../models/BookPublishers";

function findPublishers(res) {
  BookPublishers.find({}, (err, categories) => {
    if (err) {
      res.json(config.getRespData(true, MSG.internalServerErr, err));
    } else {
      res.json(config.getRespData(false, null, categories));
    }
  });
}

function addOnePublisher(data, res) {
  const publisher = new BookPublishers({ ...data });
  publisher.save(err => {
    if (err) {
      if (err.code === 11000) {
        res.json(config.getRespData(true, MSG.publisherMustBeUnique, err));
      } else {
        res.json(config.getRespData(true, MSG.cantAddNewBookCategory, err));
      }
    } else {
      res.send(config.getRespData(false));
    }
  });
}

export default { findPublishers, addOnePublisher };
