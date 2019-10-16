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
 * @param {Boolean} getFullBookInfo Отдавать ли json с данными книги где будут только id'ки в полях authors, categories, publisher и language или же отдавать собранный json со всеми этими данными из соответствующих коллекций
 */
function findBooks(res, data = {}, getFullBookInfo = false) {
  if (getFullBookInfo === "true") {
    Book.find(_.isEmpty(data) ? {} : JSON.parse(data))
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
  } else {
    Book.find(_.isEmpty(data) ? {} : JSON.parse(data), (err, books) => {
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
 * В процессе она перемещает постер, загруженный предварительно во временную папку с постерами, в постоянную папку.
 * Если в поле постер приходит пустое поле, по сути placeholder,то в базу будет добавлена именно ссылка на placeholder.
 * @param {Object} req Request
 * @param {Object} res Response
 */
function addBook(req, res) {
  const { book: bodyBook } = req.body;

  const splitedLinkToPoster = bodyBook.bookInfo.imageLinks.poster.split("/");
  const pathToTempPoster = path.join(
    __dirname,
    `../../server/${servConf.filesPaths.bookPoster.tempFolder}`,
    splitedLinkToPoster[splitedLinkToPoster.length - 1]
  );
  const pathToPostersFolder = path.join(
    __dirname,
    `../../server/${servConf.filesPaths.bookPoster.mainFolder}`,
    splitedLinkToPoster[splitedLinkToPoster.length - 1]
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
    clonedBookObj.bookInfo.imageLinks.poster = `http://localhost:${process.env.BACK_PORT}${servConf.filesPaths.placeholders.urlToPlaceholder}/imagePlaceholder.png`;

    saveBook(clonedBookObj);
  } else {
    fs.rename(pathToTempPoster, pathToPostersFolder, movePosterErr => {
      if (movePosterErr) {
        res.json(config.getRespData(true, MSG.cantAddNewBook, movePosterErr));
      } else {
        clonedBookObj.bookInfo.imageLinks.poster = `http://localhost:${
          process.env.BACK_PORT
        }${servConf.filesPaths.bookPoster.urlToPoster}/${
          splitedLinkToPoster[splitedLinkToPoster.length - 1]
        }`;

        saveBook(clonedBookObj);
      }
    });
  }
}

function thisBookOrderedOrBooked(res, query) {
  parallel(
    [
      callback => BookedBooks.findOne(JSON.parse(query), callback),
      callback => OrderedBooks.findOne(JSON.parse(query), callback)
    ],
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
