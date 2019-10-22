import _ from "lodash";
import parallel from "async/parallel";

import BookedBooks from "../models/BookedBooks";
import OrderedBooks from "../models/OrderedBooks";
import Book from "../models/Book";

import * as config from "../config";
import MSG from "../../server/config/msgCodes";
import servConf from "../../server/config/server.json";

/**
 * Функиция добавить книгу в список забронированных.
 *
 * Сначала найдет книгу по req.body.id, при ошибке поиска выдаст ошибку, иначе проверит есть ли еще свободные книги. Если нет то выдаст ошибку.
 *
 * Иначе, если количество забронированных книг и книг на руках у пользователя меньше чем значение maxBooksPerOneUserBookedAndOrderedAtTheSameTime из конфига сервера, из количества свободных книг будет вычтена одна и данные о забронированной книге будет добавлены в коллекцию с забронированными книгами.
 *
 * Иначе, если количество забронированных книг и книг на руках у пользователя равняется параметру maxBooksPerOneUserBookedAndOrderedAtTheSameTime из конфига сервера будет выдана ошибка.
 *
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {String} req.body.id ID книги
 * @param {String} req.body.userId ID пользователя
 * @param {String} req.body.readerId Номер читательского билета
 */
function bookABook(req, res) {
  const { id: bookId, userId, readerId } = req.body;

  Book.find({ _id: bookId })
    .populate("bookInfo.authors")
    .populate("bookInfo.categories")
    .populate("bookInfo.publisher")
    .populate("bookInfo.language")
    .exec((findError, books) => {
      if (findError) {
        res.json(config.getRespData(true, MSG.internalServerErr, findError));
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
            [
              callback => BookedBooks.countDocuments({ userId }, callback),
              callback => OrderedBooks.countDocuments({ userId }, callback)
            ],
            (asyncErr, results) => {
              if (asyncErr) {
                res.json(
                  config.getRespData(true, MSG.internalServerErr, asyncErr)
                );
              } else if (
                results[0] + results[1] <
                servConf.maxBooksPerOneUserBookedAndOrderedAtTheSameTime
              ) {
                Book.findOneAndUpdate(
                  { _id: bookId },
                  {
                    $inc: { "stockInfo.freeForBooking": -1 }
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
                          MSG.internalServerErr,
                          findOneAndUpdateError
                        )
                      );
                    } else {
                      const BookedBook = new BookedBooks({
                        bookId,
                        userId,
                        readerId
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

/**
 * Функция вернет забронированные книги.
 *
 * Когда функция возвращает данные по забронированным книгам она так же вернет и выборку данных по юзеру и забронированной книге.
 * @param {Object} res Response
 * @param {Object} data Параметры для запроса БД.
 */
function findBookedBooks(res, data = {}) {
  BookedBooks.find(_.isEmpty(data) ? {} : JSON.parse(data))
    .populate(
      "userId",
      "-password -emailVerified -userGroup -createdAt -readerId"
    )
    .populate({
      path: "bookId",
      populate: {
        path:
          "bookInfo.authors bookInfo.categories bookInfo.publisher bookInfo.language"
      }
    })
    .exec((findOneErr, foundBookedBooks) => {
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
    });
}

export default { bookABook, findBookedBooks };
