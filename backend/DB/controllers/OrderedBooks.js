import parallel from "async/parallel";
import _ from "lodash";

import MSG from "../../server/config/msgCodes";
import * as config from "../config";

import OrderedBooks from "../models/OrderedBooks";
import BookedBooks from "../models/BookedBooks";
import BookedBooksArchive from "../models/BookedBooksArchive";

function findOrderedBooks(res, getQuery = {}) {
  OrderedBooks.find(_.isEmpty(getQuery) ? {} : JSON.parse(getQuery))
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
    .exec((findOneErr, foundOrderedBooks) => {
      if (findOneErr) {
        res.json(config.getRespData(true, MSG.errorWhenFindOrderedBooks, {}));
      } else {
        res.json(
          config.getRespData(
            false,
            MSG.successFindOrderedBooks,
            foundOrderedBooks
          )
        );
      }
    });
}

function addOrderedBook(req, res) {
  const bookedBookData = req.body;
  bookedBookData.userId = req.middlewareUserInfo._id;

  const newOrderedBook = new OrderedBooks({
    bookId: bookedBookData.bookedBookInfo.book._id,
    userId: bookedBookData.bookedBookInfo.user._id,
    readerId: bookedBookData.bookedBookInfo.readerId
  });

  newOrderedBook.save(saveErr => {
    if (saveErr) {
      res.json(config.getRespData(true, MSG.internalServerErr, saveErr));
    } else {
      parallel(
        [
          callback =>
            BookedBooks.deleteOne(
              {
                bookId: bookedBookData.bookedBookInfo.book._id,
                readerId: bookedBookData.bookedBookInfo.readerId
              },
              callback
            ),
          callback => {
            const newArchivedBookedBook = new BookedBooksArchive({
              bookedBookInfo: {
                bookInfo: bookedBookData.bookedBookInfo.book,
                userInfo: bookedBookData.bookedBookInfo.user,
                createdAt: bookedBookData.bookedBookInfo.createdAt
              },
              status: bookedBookData.status,
              comment: bookedBookData.comment
            });

            newArchivedBookedBook.save(callback);
          }
        ],
        parErr => {
          if (parErr) {
            res.json(config.getRespData(true, MSG.internalServerErr, saveErr));
          } else {
            res.send(config.getRespData(false));
          }
        }
      );
    }
  });
}

function getOrderedBooksCount(res) {
  OrderedBooks.countDocuments({}, (err, number) => {
    if (err) {
      res.json(config.getRespData(true, null, err));
    } else {
      res.json(config.getRespData(false, null, number));
    }
  });
}

export default { addOrderedBook, findOrderedBooks, getOrderedBooksCount };
