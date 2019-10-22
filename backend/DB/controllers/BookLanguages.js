import _ from "lodash";

import MSG from "../../server/config/msgCodes";
import * as config from "../config";

import BookLanguages from "../models/BookLanguages";

function findBookLanguage(res) {
  BookLanguages.find({}, (err, categories) => {
    if (err) {
      res.json(config.getRespData(true, MSG.internalServerErr, err));
    } else {
      res.json(config.getRespData(false, null, categories));
    }
  });
}

function addOneLang(data, res) {
  const language = new BookLanguages({ ...data });
  language.save(err => {
    if (err) {
      if (err.code === 11000) {
        res.json(config.getRespData(true, MSG.languageMustBeUnique, err));
      } else {
        res.json(config.getRespData(true, MSG.cantAddNewBookLanguage, err));
      }
    } else {
      res.send(config.getRespData(false));
    }
  });
}

export default { findBookLanguage, addOneLang };
