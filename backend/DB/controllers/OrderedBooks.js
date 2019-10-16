import parallel from "async/parallel";

import MSG from "../../server/config/msgCodes";
import * as config from "../config";

import OrderedBooks from "../models/OrderedBooks";
import BookedBooks from "../models/BookedBooks";
import BookedBooksArchive from "../models/BookedBooksArchive";

function addOrderedBook(orderBookData, res) {
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

export default { addOrderedBook };
