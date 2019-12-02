import path from "path";
import fs from "fs-extra";
import _ from "lodash";
import parallel from "async/parallel";

import Book from "../models/Book";
import BookedBooks from "../models/BookedBooks";
import OrderedBooks from "../models/OrderedBooks";
import BooksArchive from "../models/BooksArchive";

import MSG from "../../server/config/msgCodes";
import * as config from "../config";

import servConf from "../../server/config/server.json";

/**
 * Функция поиска книг.
 *
 * Express параметры:
 * @param {Object} res Response
 * @param {Object} req Request
 *
 * Параметры запроса:
 * @param {Object} data Данные для поиска нужной книги или книг.
 * Если `{}` то будут отданы все книги.
 * Если например `{ _id: id_книги }` то будет найдена именно книга с указанным `_id`.
 * Кейсы по составлению запросов к MongoDB можно загуглить.
 * Запросы делаются напрямую в базу, поэтому необходимо валидно составлять объект запроса.
 *
 * @param {Object=} options Объект с опциями поиска. Будет задан данными по умолчанию при полном отсутствии.
 * @param {Number} options.fetch_type Вид возвращаемых данных. По умолчанию `0`.
 *
 * `0` - вернуть данные по книге как есть (прим.: авторы будут возвращены в виде массива id и т.д. смотри модель `Book`).
 *
 * `1` - вернуть данные по книге и заполнить данными объекты, в которых изначально есть только id (смотри модель `Book`)).
 *
 * @param {Number} options.page Номер страницы выборки. По умолчанию `1`.
 * @param {String} options.sort Сортировка. По умолчанию `desc`.
 * @param {Number} options.limit Количество элементов в одной выборке. За 1 раз не более 99 элементов. По умолчанию `99`.
 *
 * ВНИМАНИЕ!
 * `options.limit` по умолчанию `99`. Если не указать `options.limit` но при этом указать `options.page`, то, если в базе элементов будет меньше `99`-ти то поиск не даст результатов!
 *
 * Возвращаемые хедеры:
 *
 * `max-elements` Количество элементов в базе, подходящих под запрос.
 */
function findBooks(res, req, data = {}) {
  let { options } = req.query;

  if (_.isUndefined(options)) {
    options = {
      page: 1,
      limit: 99,
      fetch_type: 0,
      sort: "desc"
    };
  } else {
    options = JSON.parse(options);
  }

  options.page = _.isUndefined(options.page) ? 1 : options.page;
  options.sort = _.isUndefined(options.sort) ? 1 : options.sort;
  options.limit = _.isUndefined(options.limit) ? 99 : options.limit;
  options.fetch_type = _.isUndefined(options.fetch_type)
    ? 0
    : options.fetch_type;

  const getSkip = () => {
    if (options.page === 1) {
      return 0;
    }
    return options.limit * (options.page - 1);
  };

  Book.countDocuments(
    _.isEmpty(data) ? {} : JSON.parse(data),
    (countError, count) => {
      res.set({
        "max-elements": count,
        ...options
      });
      Book.find(_.isEmpty(data) ? {} : JSON.parse(data))
        .sort({ dateAdded: options.sort })
        .skip(getSkip())
        .limit(options.limit)
        .populate(
          options.fetch_type === 0
            ? ""
            : [
                {
                  path: "bookInfo.authors"
                },
                {
                  path: "bookInfo.categories"
                },
                {
                  path: "bookInfo.publisher"
                },
                {
                  path: "bookInfo.language"
                }
              ]
        )
        .exec((findBookError, books) => {
          if (findBookError) {
            res.json(config.getRespData(true, MSG.bookNotFound, findBookError));
          } else {
            res.json(config.getRespData(false, null, books));
          }
        });
    }
  );
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
  const base64StringToReplace = /^data:image\/png;base64,/;
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

  clonedBookObj.addedByUser = req.middlewareUserInfo._id;

  if (bodyBook.bookInfo.imageLinks.poster === "") {
    clonedBookObj.bookInfo.imageLinks.poster = `${servConf.filesPaths.placeholders.urlToPlaceholder}/imagePlaceholder.png`;

    saveBook(clonedBookObj);
  } else if (
    clonedBookObj.bookInfo.imageLinks.poster.search(base64StringToReplace) !==
    -1
  ) {
    const base64Poster = clonedBookObj.bookInfo.imageLinks.poster.replace(
      base64StringToReplace,
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
  } else {
    saveBook(clonedBookObj);
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

function updateBook(req, res) {
  const { book } = req.body;
  const clonedBook = { ...book };
  const detectNewPoster = clonedBook.bookInfo.imageLinks.poster.search(
    "base64"
  );
  const dateNow = Date.now();
  const posterName = `book_poster_${dateNow}.png`;

  const pathToNewPoster = path.join(
    __dirname,
    `../../server/${servConf.filesPaths.bookPoster.mainFolder}`,
    posterName
  );

  clonedBook.editInfo[clonedBook.editInfo.length - 1] = {
    ...clonedBook.editInfo[clonedBook.editInfo.length - 1],
    userId: req.middlewareUserInfo._id,
    editedAt: dateNow
  };

  const saveBook = () => {
    Book.update({ _id: book._id }, { ...book }, err => {
      if (err) {
        res.json(config.getRespData(true, MSG.cantUpdateBook, err));
      } else {
        res.json(config.getRespData(false, MSG.bookWasUpdated));
      }
    });
  };

  if (detectNewPoster !== -1) {
    const base64Poster = clonedBook.bookInfo.imageLinks.poster.replace(
      /^data:image\/png;base64,/,
      ""
    );

    fs.writeFile(pathToNewPoster, base64Poster, "base64", err => {
      if (err) {
        res.json(config.getRespData(true, MSG.cantUpdateBook, err));
      } else {
        clonedBook.bookInfo.imageLinks.poster = `${servConf.filesPaths.bookPoster.urlToPoster}/${posterName}`;

        saveBook(clonedBook);
      }
    });
  } else {
    saveBook(clonedBook);
  }
}

function deleteBook(res, req) {
  const { id } = req.params;

  parallel(
    {
      BookedBooks: cb => BookedBooks.countDocuments({ bookId: id }, cb),
      OrderedBooks: cb => OrderedBooks.countDocuments({ bookId: id }, cb)
    },
    (parErr, result) => {
      if (parErr) {
        res.json(config.getRespData(true, MSG.internalServerErr, parErr));
      } else if (result.BookedBooks !== 0 || result.OrderedBooks !== 0) {
        res.json(
          config.getRespData(true, MSG.cantDeleteBook, {
            bookOnHand: true,
            result
          })
        );
      } else {
        Book.findOne({ _id: id }, (err, book) => {
          if (err) {
            res.json(config.getRespData(true, MSG.internalServerErr, err));
          } else {
            const newArchivedBook = new BooksArchive({
              book,
              userId: req.middlewareUserInfo._id
            });

            newArchivedBook.save(bookSaveErr => {
              if (bookSaveErr) {
                res.json(
                  config.getRespData(
                    true,
                    MSG.cantAddNewBookToArchive,
                    bookSaveErr
                  )
                );
              }
            });
          }
        }).remove(err => {
          if (err) {
            res.json(config.getRespData(true, MSG.cantDeleteBook, err));
          } else {
            res.json(config.getRespData(false, MSG.bookWasDeleted));
          }
        });
      }
    }
  );
}

export default {
  findBooks,
  addBook,
  thisBookOrderedOrBooked,
  updateBook,
  deleteBook
};
