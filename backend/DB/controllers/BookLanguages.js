import _ from "lodash";

import MSG from "../../server/config/msgCodes";
import * as config from "../config";

import BookLanguages from "../models/BookLanguages";

function findBookLanguage(res, query = {}) {
  BookLanguages.find(
    _.isEmpty(query) ? {} : JSON.parse(query),
    (err, categories) => {
      if (err) {
        res.json(config.getRespData(true, MSG.internalServerErr, err));
      } else {
        res.json(config.getRespData(false, null, categories));
      }
    }
  );
}

function addOneLang(data, res) {
  const language = new BookLanguages({ ...data });
  language.save((err, newLang) => {
    if (err) {
      if (err.code === 11000) {
        res.json(config.getRespData(true, MSG.languageMustBeUnique, err));
      } else {
        res.json(config.getRespData(true, MSG.cantAddNewBookLanguage, err));
      }
    } else {
      res.send(config.getRespData(false, null, newLang));
    }
  });
}

export default { findBookLanguage, addOneLang };
