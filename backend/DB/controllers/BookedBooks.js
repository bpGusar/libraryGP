import _ from "lodash";
import parallel from "async/parallel";

import BookedBooks from "../models/BookedBooks";
import Book from "../models/Book";

import * as config from "../config";
import MSG from "../../server/config/msgCodes";
import servConf from "../../server/config/server.json";

// TODO: сделать проверку - смотреть сколько книг уже на руках у пользователя и сколько он уже забронировал и если в сумме 5 то выдавать ошибку
// СДЕЛАНА ПРОВЕРКА ЗАБРОНИРОВАННЫХ КНИГ
function bookABook(req, res) {
  const { id: bookId, userId } = req.body;

  Book.find({ _id: bookId })
    .populate("bookInfo.authors")
    .populate("bookInfo.categories")
    .populate("bookInfo.publisher")
    .populate("bookInfo.language")
    .exec((findError, books) => {
      if (findError) {
        res.json(config.getRespData(true, MSG.internalErr500, findError));
      } else {
        const book = books[0];

        if (book.stockInfo.freeForBooking === 0) {
          res.json(
            config.getRespData(false, MSG.bookOutOfStock, {
              bookBooked: false,
              books
            })
          );
        } else {
          parallel(
            [callback => BookedBooks.countDocuments({ userId }, callback)],
            (asyncErr, results) => {
              if (asyncErr) {
                res.json(
                  config.getRespData(true, MSG.internalErr500, asyncErr)
                );
              } else if (
                results[0] <
                servConf.maxBooksPerOneUserBookedAndOrderedAtTheSameTime
              ) {
                Book.findOneAndUpdate(
                  { _id: bookId },
                  {
                    stockInfo: {
                      ...book.stockInfo,
                      freeForBooking: book.stockInfo.freeForBooking - 1
                    }
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
                          res.json(
                            config.getRespData(
                              true,
                              MSG.errorWhenBookABook,
                              err
                            )
                          );
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
              } else {
                res.json(
                  config.getRespData(
                    true,
                    MSG.youHaveMaxQuantityOfBooksOnYourHands
                  )
                );
              }
            }
          );
        }
      }
    });
}

function findBookedBooks(res, data = {}) {
  BookedBooks.find(
    _.isEmpty(data) ? {} : JSON.parse(data),
    (findOneErr, foundBookedBooks) => {
      if (findOneErr) {
        res.json(config.getRespData(true, MSG.errorWhenFindBookedBooks, {}));
      } else {
        res.json(
          config.getRespData(
            false,
            MSG.successFindBookedBooks,
            foundBookedBooks
          )
        );
      }
    }
  );
}

export default { bookABook, findBookedBooks };
