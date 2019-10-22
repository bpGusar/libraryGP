import parallel from "async/parallel";

import MSG from "../../server/config/msgCodes";
import * as config from "../config";

import OrderedBooksArchive from "../models/OrderedBooksArchive";
import OrderedBooks from "../models/OrderedBooks";
import Book from "../models/Book";

function bookReturn(req, res) {
  let orderedBookData = { ...req.body };

  orderedBookData = {
    ...orderedBookData,
    userId: req.middlewareUserInfo._id
  };

  const newArchivedOrder = new OrderedBooksArchive({ ...orderedBookData });

  newArchivedOrder.save(saveErr => {
    if (saveErr) {
      res.json(config.getRespData(true, MSG.internalServerErr, saveErr));
    } else {
      parallel(
        [
          cb =>
            OrderedBooks.deleteOne(
              {
                bookId: orderedBookData.orderedBookInfo.bookId._id,
                readerId: orderedBookData.orderedBookInfo.readerId
              },
              cb
            ),
          cb =>
            Book.findOneAndUpdate(
              { _id: orderedBookData.orderedBookInfo.bookId._id },
              {
                $inc: { "stockInfo.freeForBooking": 1 }
              },
              { new: true },
              cb
            )
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

export default { bookReturn };
