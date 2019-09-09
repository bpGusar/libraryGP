import _ from "lodash";

import { MSG } from "../../../config/msgCodes";
import * as config from "../config";

import BookPublishers from "../models/BookPublishers";

function findPublishers(res, data = {}) {
  BookPublishers.find(
    _.isEmpty(data) ? {} : JSON.parse(data),
    (err, categories) => {
      if (err) {
        res.json(config.getRespData(true, MSG.internalErr500, err));
      } else {
        res.json(config.getRespData(false, null, categories));
      }
    }
  );
}

function addOnePublisher(publisherName, res) {
  const publisher = new BookPublishers({ publisherName });
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
