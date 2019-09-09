import _ from "lodash";

import { MSG } from "../../../config/msgCodes";
import * as config from "../config";

import Authors from "../models/Authors";

function findOneAuthor(authorName, res) {
  Authors.findOne(authorName, (err, author) => {
    if (err) {
      res.json(config.getRespData(true, MSG.internalErr500, err));
    } else if (!author) {
      res.json(
        config.getRespData(true, MSG.cantFindAuthor, {
          authorName
        })
      );
    } else {
      res.json(config.getRespData(false, null, author));
    }
  });
}

function addOneAuthor(authorName, res) {
  const author = new Authors(authorName);
  author.save(err => {
    if (err) {
      if (err.code === 11000) {
        res.json(config.getRespData(true, MSG.authorMustBeUnique, err));
      } else {
        res.json(config.getRespData(true, MSG.cantAddAuthor, err));
      }
    } else {
      res.send(config.getRespData(false));
    }
  });
}

function findAuthors(res, data = {}) {
  Authors.find(_.isEmpty(data) ? {} : JSON.parse(data), (err, author) => {
    if (err) {
      res.json(config.getRespData(true, MSG.internalErr500, err));
    } else {
      res.json(config.getRespData(false, null, author));
    }
  });
}

export default { findOneAuthor, addOneAuthor, findAuthors };
