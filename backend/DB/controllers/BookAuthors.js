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

function addOneAuthor(data, res) {
  const author = new Authors({ ...data });
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
 */
function findAuthors(res) {
  Authors.find({}, (err, author) => {
    if (err) {
      res.json(config.getRespData(true, MSG.internalServerErr, err));
    } else {
      res.json(config.getRespData(false, null, author));
    }
  });
}

export default { findOneAuthor, addOneAuthor, findAuthors };
