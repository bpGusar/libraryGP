import Book from "../models/Book";

import MSG from "../../server/config/msgCodes";
import * as config from "../config";

function findBooks(res, data = {}, fullBookInfo = null) {
  if (fullBookInfo === "true") {
    Book.find(data)
      .populate("bookInfo.authors")
      .populate("bookInfo.categories")
      .populate("bookInfo.publisher")
      .populate("bookInfo.language")
      .exec((err, books) => {
        if (err) {
          res.json(config.getRespData(true, MSG.internalErr500, err));
        } else {
          res.json(config.getRespData(false, null, books));
        }
      });
  } else {
    Book.find(data, (err, books) => {
      if (err) {
        res.json(config.getRespData(true, MSG.internalErr500, err));
      } else {
        res.json(config.getRespData(false, null, books));
      }
    });
  }
}

function addBook(req, res) {
  const { book: bodyBook } = req.body;

  const book = new Book({ ...bodyBook });

  book.save(err => {
    if (err) {
      res.json(config.getRespData(true, MSG.cantAddNewBook, err));
    } else {
      res.send(config.getRespData(false, MSG.bookAddedSuccessfully));
    }
  });
}

export default { findBooks, addBook };
