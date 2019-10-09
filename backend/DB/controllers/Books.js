import Book from "../models/Book";
import BookedBooks from "../models/BookedBooks";

import MSG from "../../server/config/msgCodes";
import * as config from "../config";

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

function bookABook(req, res) {
  const { id: bookId, userId } = req.body;

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
          .exec((findOneAndUpdateError, findOneAndUpdateBook) => {
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
                      books: [findOneAndUpdateBook]
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

export default { findBooks, addBook, bookABook };
