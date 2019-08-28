/* eslint-disable import/prefer-default-export */
import Mongoose from "mongoose";

import { MSG } from "../../../config/msgCodes";
import { getRespData } from "../config";

import "../models/Authors";

const Authors = Mongoose.model("Authors");

export function setAuthor(authorName, res) {
  const author = new Authors({ authorName });
  author.save(err => {
    if (err) {
      res.res.json(getRespData(true, MSG.cantAddAuthor, err));
    } else {
      res.send(getRespData(false));
    }
  });
}
