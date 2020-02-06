import parallel from "async/parallel";
import _ from "lodash";

import MSG from "../../config/msgCodes";
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
  const bookedBookId = req.params.id;

  BookedBooks.find({ _id: bookedBookId }, (findBBErr, bookedBook) => {
    if (findBBErr) {
      res.json(config.getRespData(true, MSG.internalServerErr, findBBErr));
    } else {
      const newOrderedBook = new OrderedBooks({
        bookId: bookedBook[0].bookId,
        userId: req.body.userId,
        addedByUser: req.middlewareUserInfo._id,
        readerId: bookedBook[0].readerId
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
                    _id: bookedBook[0]._id
                  },
                  callback
                ),
              callback => {
                const newArchivedBookedBook = new BookedBooksArchive({
                  bookedBookInfo: {
                    bookId: bookedBook[0].bookId,
                    userId: bookedBook[0].userId,
                    createdAt: bookedBook[0].createdAt
                  },
                  status: req.body.status,
                  comment: req.body.comment,
                  userId: req.middlewareUserInfo._id
                });

                newArchivedBookedBook.save(callback);
              }
            ],
            parErr => {
              if (parErr) {
                res.json(
                  config.getRespData(true, MSG.internalServerErr, saveErr)
                );
              } else {
                res.send(config.getRespData(false));
              }
            }
          );
        }
      });
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
