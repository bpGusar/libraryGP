import path from "path";
import fs from "fs";
import _ from "lodash";
import parallel from "async/parallel";

import Book from "../models/Book";
import BookedBooks from "../models/BookedBooks";
import OrderedBooks from "../models/OrderedBooks";

import MSG from "../../server/config/msgCodes";
import * as config from "../config";

import servConf from "../../server/config/server.json";

/**
 * @param {Object} res Response
 * @param {Object} data Данные для поиска нужной книги или книг. Если {} то будут отданы все книги.
 * @param {Boolean} fetch_type 0 - вернуть данные по книге как есть, 1 - вернуть данные по книге и заполнить данными объекты authors, categories, publisher, language
 */
function findBooks(res, data = {}, fetch_type = "0") {
  if (fetch_type === "1") {
    Book.find(_.isEmpty(data) ? {} : { _id: data.id })
      .populate("bookInfo.authors")
      .populate("bookInfo.categories")
      .populate("bookInfo.publisher")
      .populate("bookInfo.language")
      .exec((err, books) => {
        if (err) {
          res.json(config.getRespData(true, MSG.bookNotFound, err));
        } else {
          res.json(config.getRespData(false, null, books));
        }
      });
  } else if (fetch_type === "0") {
    Book.find(_.isEmpty(data) ? {} : { _id: data.id }, (err, books) => {
      if (err) {
        res.json(config.getRespData(true, MSG.bookNotFound, err));
      } else {
        res.json(config.getRespData(false, null, books));
      }
    });
  }
}

/**
 * Функция принимает в себя данные о книге.
 * В процессе конвертирует постер из base64 в png.
 * Если в поле постер приходит пустое поле (постер не был выбран),то в базу будет добавлена ссылка на placeholder.
 * @param {Object} req Request
 * @param {Object} res Response
 */
function addBook(req, res) {
  const { book: bodyBook } = req.body;
  const posterName = `book_poster_${Date.now()}.png`;

  const pathToNewPoster = path.join(
    __dirname,
    `../../server/${servConf.filesPaths.bookPoster.mainFolder}`,
    posterName
  );

  const saveBook = book => {
    const newBook = new Book({ ...book });

    newBook.save(bookSaveErr => {
      if (bookSaveErr) {
        res.json(config.getRespData(true, MSG.cantAddNewBook, bookSaveErr));
      } else {
        res.send(config.getRespData(false, MSG.bookAddedSuccessfully));
      }
    });
  };

  const clonedBookObj = { ...bodyBook };
  if (bodyBook.bookInfo.imageLinks.poster === "") {
    clonedBookObj.bookInfo.imageLinks.poster = `${servConf.filesPaths.placeholders.urlToPlaceholder}/imagePlaceholder.png`;

    saveBook(clonedBookObj);
  } else {
    const base64Poster = clonedBookObj.bookInfo.imageLinks.poster.replace(
      /^data:image\/png;base64,/,
      ""
    );

    fs.writeFile(pathToNewPoster, base64Poster, "base64", err => {
      if (err) {
        res.json(config.getRespData(true, MSG.cantAddNewBook, err));
      } else {
        clonedBookObj.bookInfo.imageLinks.poster = `${servConf.filesPaths.bookPoster.urlToPoster}/${posterName}`;

        saveBook(clonedBookObj);
      }
    });
  }
}

function thisBookOrderedOrBooked(res, req) {
  const query = {
    bookId: req.params.id,
    userId: req.middlewareUserInfo._id
  };
  parallel(
    {
      BookedBooks: callback =>
        BookedBooks.find(query, callback).select("_id orderedUntil"),
      OrderedBooks: callback =>
        OrderedBooks.find(query, callback).select("_id orderedUntil")
    },
    (asyncErr, results) => {
      if (asyncErr) {
        res.json(config.getRespData(true, MSG.internalServerErr, asyncErr));
      } else {
        res.json(config.getRespData(false, null, results));
      }
    }
  );
}

export default { findBooks, addBook, thisBookOrderedOrBooked };
