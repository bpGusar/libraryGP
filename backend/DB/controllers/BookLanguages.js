import _ from "lodash";

import { MSG } from "../../../config/msgCodes";
import * as config from "../config";

import BookLanguages from "../models/BookLanguages";

function findBookLanguage(res, data = {}) {
  BookLanguages.find(
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

function addOneLang(languageName, res) {
  const language = new BookLanguages(languageName);
  language.save(err => {
    if (err) {
      res.json(config.getRespData(true, MSG.cantAddNewBookCategory, err));
    } else {
      res.send(config.getRespData(false));
    }
  });
}

export default { findBookLanguage, addOneLang };
