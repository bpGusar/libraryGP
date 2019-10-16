import MSG from "../../server/config/msgCodes";
import * as config from "../config";

import BookedBooksArchive from "../models/BookedBooksArchive";
import BookedBooks from "../models/BookedBooks";
// TODO: доделать архивацию бронирований

function addBookedBookInAchive(orderData, res) {
  const newArchivedOrder = new BookedBooksArchive({ ...orderData });

  newArchivedOrder.save(saveErr => {
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

export default { addBookedBookInAchive };
