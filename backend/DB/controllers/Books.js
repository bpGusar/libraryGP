import path from "path";
import fs from "fs";

import Book from "../models/Book";
import BookedBooks from "../models/BookedBooks";

import MSG from "../../server/config/msgCodes";
import * as config from "../config";

import serverConfig from "../../server/config/server.json";

/**
 * @param {Object} res Response
 * @param {Object} data Данные для поиска нужной книги или книг. Если {} то будут отданы все книги.
 * @param {Boolean} getFullBookInfo Отдавать ли json с данными книги где будут только id'ки в полях authors, categories, publisher и language или же отдавать собранный json со всеми этими данными из соответствующих коллекций
 */
function findBooks(res, data = {}, getFullBookInfo = false) {
  if (getFullBookInfo === "true") {
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

// TODO: сделать проверку - смотреть сколько книг уже на руках у пользователя и сколько он уже забронировал и если в сумме больше 5ти то выдавать ошибку
function bookABook(req, res) {
  const { id: bookId, userId } = req.body;
  let bookedAndOrderedBooksArr = 0;

  Book.find({ _id: bookId }, (findError, books) => {
    if (findError) {
      res.json(config.getRespData(true, MSG.internalErr500, findError));
    } else {
      const book = books[0];

      if (book.stockInfo.freeForBooking === 0) {
        res.json(
          config.getRespData(true, MSG.bookOutOfStock, {
            bookBooked: false,
            books
          })
        );
      } else {
        BookedBooks.countDocuments(
          { userId },
          (bookedBooksrr, countBookedBooks) => {
            if (bookedBooksrr) throw bookedBooksrr;
            bookedAndOrderedBooksArr += countBookedBooks;
          }
        );
        setTimeout(() => {
          console.log(bookedAndOrderedBooksArr);
        }, 1000);

        Book.findOneAndUpdate(
          { _id: bookId },
          {
            stockInfo: { freeForBooking: book.stockInfo.freeForBooking - 1 }
          },
          { new: true }
        )
          .populate("bookInfo.authors")
          .populate("bookInfo.categories")
          .populate("bookInfo.publisher")
          .populate("bookInfo.language")
          .exec((findOneAndUpdateError, findOneAndUpdateBookObj) => {
            if (findOneAndUpdateError) {
              res.json(
                config.getRespData(
                  true,
                  MSG.internalErr500,
                  findOneAndUpdateError
                )
              );
            } else {
              const BookedBook = new BookedBooks({
                bookId,
                userId
              });

              BookedBook.save(err => {
                if (err) {
                  res.json(config.getRespData(true, MSG.cantAddNewBook, err));
                } else {
                  res.json(
                    config.getRespData(false, MSG.bookBooked, {
                      bookBooked: true,
                      books: [findOneAndUpdateBookObj]
                    })
                  );
                }
              });
            }
          });
      }
    }
  });
}

/**
 * Функция принимает в себя данные о книге с фронта.
 * В процессе она перемещает постер, загруженный предварительно во временную папку с постерами, в постоянную папку.
 * Если приходит placeholder вместо постера то в базу будет добавлена именно ссылка на placeholder.
 * @param {Object} req Request
 * @param {Object} res Response
 */
function addBook(req, res) {
  const { book: bodyBook } = req.body;

  const posterSplitedLink = bodyBook.bookInfo.imageLinks.poster.split("/");
  const pathToTempPoster = path.join(
    __dirname,
    `../../server/${serverConfig.filesPaths.bookPoster.tempFolder}`,
    posterSplitedLink[posterSplitedLink.length - 1]
  );
  const pathToPostersFolder = path.join(
    __dirname,
    `../../server/${serverConfig.filesPaths.bookPoster.mainFolder}`,
    posterSplitedLink[posterSplitedLink.length - 1]
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
    clonedBookObj.bookInfo.imageLinks.poster = `http://localhost:${process.env.BACK_PORT}${serverConfig.filesPaths.placeholders.urlToPlaceholder}/imagePlaceholder.png`;

    saveBook(clonedBookObj);
  } else {
    fs.rename(pathToTempPoster, pathToPostersFolder, movePosterErr => {
      if (movePosterErr) {
        res.json(config.getRespData(true, MSG.cantAddNewBook, movePosterErr));
      } else {
        clonedBookObj.bookInfo.imageLinks.poster = `http://localhost:${
          process.env.BACK_PORT
        }${serverConfig.filesPaths.bookPoster.urlToPoster}/${
          posterSplitedLink[posterSplitedLink.length - 1]
        }`;

        saveBook(clonedBookObj);
      }
    });
  }
}

export default { findBooks, addBook, bookABook };
