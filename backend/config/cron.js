import parallel from "async/parallel";
import nodemailer from "nodemailer";
import { DateTime } from "luxon";
import _ from "lodash";

import OrderedBooks from "../DB/models/OrderedBooks";
import BookedBooks from "../DB/models/BookedBooks";
import BookedBooksArchive from "../DB/models/BookedBooksArchive";
import Book from "../DB/models/Book";

import serverJson from "./server.json";

import { BookExpiresTemplate } from "../server/emailTemplates/BookExpires";

const transporter = nodemailer.createTransport(serverJson.emailConfig);

const cronFunctions = {
  sendEmailNDaysBeforeBookExpires: {
    comment:
      "Каждый день в 0 часов 0 минут 0 секунд (то есть в самом начале суток) проводит проверку книг на руках. Если до даты возврата книги осталось `sendEmailNDaysBeforeBookExpires` дня будет отправлено сообщение на электронную почту.",
    cron: {
      time: "0 0 */1 * *",
      function: () => {
        OrderedBooks.find({})
          .populate("userId", "email firstName patronymic lastName")
          .populate("bookId", "bookInfo.title")
          .exec((err, orderedBooks) => {
            if (!_.isUndefined(orderedBooks.length)) {
              if (orderedBooks.length !== 0) {
                const todayDate = DateTime.local();

                orderedBooks.forEach(orderedBook => {
                  const orderedUntilDateMinusNDays = DateTime.fromMillis(
                    new Date(orderedBook.orderedUntil).getTime()
                  ).minus({
                    days: serverJson.sendEmailNDaysBeforeBookExpires
                  });

                  if (
                    todayDate.hasSame(orderedUntilDateMinusNDays, "day") &&
                    todayDate.hasSame(orderedUntilDateMinusNDays, "year") &&
                    todayDate.hasSame(orderedUntilDateMinusNDays, "month")
                  ) {
                    transporter.sendMail(
                      BookExpiresTemplate(orderedBook),
                      emailSentError => {
                        if (emailSentError) throw emailSentError;
                      }
                    );
                  }
                });
              }
            }
          });
      }
    }
  },
  deleteBookedBookIfNDaysHavePassed: {
    comment:
      "Каждый день в 0 часов 0 минут 0 секунд (то есть в самом начале суток) проводит проверку забронированных книг. Если книга забронирована `deleteBookedBookIfNDaysHavePassed` дня назад и день проверки это уже 4 день брони то удалить книгу из брони и вернуть в базу.",
    cron: {
      time: "0 0 */1 * *",
      function: () => {
        BookedBooks.find({}, (err, bookedBooksDocs) => {
          if (!_.isUndefined(bookedBooksDocs.length)) {
            if (bookedBooksDocs.length !== 0) {
              const todayDate = DateTime.local();
              bookedBooksDocs.forEach(bookedBook => {
                const bookedAtDatePlusNDays = DateTime.fromMillis(
                  new Date(bookedBook.createdAt).getTime()
                ).plus({ days: serverJson.deleteBookedBookIfNDaysHavePassed });
                if (
                  todayDate.hasSame(bookedAtDatePlusNDays, "day") &&
                  todayDate.hasSame(bookedAtDatePlusNDays, "year") &&
                  todayDate.hasSame(bookedAtDatePlusNDays, "month")
                ) {
                  const archivedData = {
                    comment: "Бронь не была активирована.",
                    bookedBookInfo: {
                      bookId: bookedBook._doc.bookId,
                      userId: bookedBook._doc.userId,
                      createdAt: bookedBook._doc.createdAt
                    },
                    status: "rejected",
                    userId: serverJson.cronUserId
                  };
                  parallel([
                    callback =>
                      BookedBooks.deleteOne(
                        {
                          bookId: bookedBook.bookId,
                          readerId: bookedBook.readerId
                        },
                        callback
                      ),
                    callback =>
                      Book.findOneAndUpdate(
                        { _id: bookedBook.bookId },
                        {
                          $inc: { "stockInfo.freeForBooking": 1 }
                        }
                      ).exec(callback),
                    callback => {
                      const newArchivedBookedBook = new BookedBooksArchive({
                        ...archivedData
                      });

                      newArchivedBookedBook.save(callback);
                    }
                  ]);
                }
              });
            }
          }
        });
      }
    }
  }
};

export default cronFunctions;
