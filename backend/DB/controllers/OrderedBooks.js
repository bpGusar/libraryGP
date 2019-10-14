// import _ from "lodash";

import MSG from "../../server/config/msgCodes";
import * as config from "../config";

import OrderedBooks from "../models/OrderedBooks";
import BookedBooks from "../models/BookedBooks";

function addOrderedBook(orderBookData, res) {
  const newOrderedBook = new OrderedBooks({ orderBookData });

  newOrderedBook.save(saveErr => {
    if (saveErr) {
      res.json(config.getRespData(true, MSG.internalServerErr, saveErr));
    } else {
      BookedBooks.deleteOne(
        { bookId: orderBookData.bookId, readerId: orderBookData.readerId },
        removeErr => {
          if (removeErr) {
            res.json(
              config.getRespData(true, MSG.internalServerErr, removeErr)
            );
          } else {
            res.send(config.getRespData(false));
          }
        }
      );
    }
  });
}

export default { addOrderedBook };
