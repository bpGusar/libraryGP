import parallel from "async/parallel";
import _ from "lodash";

import MSG from "../../server/config/msgCodes";
import * as config from "../config";

import OrderedBooks from "../models/OrderedBooks";
import BookedBooks from "../models/BookedBooks";
import BookedBooksArchive from "../models/BookedBooksArchive";

function findOrderedBooks(res, getQery = {}) {
  OrderedBooks.find(_.isEmpty(getQery) ? {} : JSON.parse(getQery))
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
  const orderBookData = req.body;
  orderBookData.userId = req.middlewareUserInfo._id;

  const newOrderedBook = new OrderedBooks({ ...orderBookData.bookedBookInfo });

  newOrderedBook.save(saveErr => {
    if (saveErr) {
      res.json(config.getRespData(true, MSG.internalServerErr, saveErr));
    } else {
      parallel(
        [
          callback =>
            BookedBooks.deleteOne(
              {
                bookId: orderBookData.bookedBookInfo.bookId,
                readerId: orderBookData.bookedBookInfo.readerId
              },
              callback
            ),
          callback => {
            const newArchivedBookedBook = new BookedBooksArchive({
              ...orderBookData
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

export default { addOrderedBook, findOrderedBooks };
