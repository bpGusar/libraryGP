import _ from "lodash";

import MSG from "../../server/config/msgCodes";
import * as config from "../config";

import Authors from "../models/Authors";

function findOneAuthor(authorName, res) {
  Authors.findOne(authorName, (err, author) => {
    if (err) {
      res.json(config.getRespData(true, MSG.internalServerErr, err));
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

/**
 * Возвращает массив авторов
 * @param res {Object} Response
 * @param data {Object} Либо {} (или не передавать ничего в аргумент data) если нужно взять всех авторов,
 * либо массив с авторами вида { _id: { $in: ["1", "2", ...] }
 */
function findAuthors(res, data = {}) {
  Authors.find(_.isEmpty(data) ? {} : JSON.parse(data), (err, author) => {
    if (err) {
      res.json(config.getRespData(true, MSG.internalServerErr, err));
    } else {
      res.json(config.getRespData(false, null, author));
    }
  });
}

export default { findOneAuthor, addOneAuthor, findAuthors };
