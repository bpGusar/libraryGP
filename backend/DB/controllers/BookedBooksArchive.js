import parallel from "async/parallel";

import MSG from "../../server/config/msgCodes";
import * as config from "../config";

import BookedBooksArchive from "../models/BookedBooksArchive";
import BookedBooks from "../models/BookedBooks";
import Book from "../models/Book";

// TODO: доделать архивацию бронирований

function rejectOrdering(bookedBookData, res) {
  const newArchivedReservation = new BookedBooksArchive({ ...bookedBookData });

  newArchivedReservation.save(saveErr => {
    if (saveErr) {
      res.json(config.getRespData(true, MSG.internalServerErr, saveErr));
    } else {
      parallel(
        [
          cb =>
            BookedBooks.deleteOne(
              {
                bookId: bookedBookData.bookedBookInfo.bookId._id,
                readerId: bookedBookData.bookedBookInfo.readerId
              },
              cb
            ),
          cb =>
            Book.findOneAndUpdate(
              { _id: bookedBookData.bookedBookInfo.bookId._id },
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

export default { rejectOrdering };
