import nodemailer from "nodemailer";
import { DateTime } from "luxon";

import OrderedBooks from "../../DB/models/OrderedBooks";

import serverJson from "./server.json";

import { BookExpiresTemplate } from "../emailTemplates/BookExpires";

const transporter = nodemailer.createTransport(serverJson.emailConfig);

const cronFunctions = {
  sendEmailThreeDaysBeforeBookExpires: {
    comment:
      "Каждый день в 0 часов 0 минут 0 секунд (то есть в самом начале суток) проводит проверку книг на руках. Если до даты возврата книги осталось 3 дня будет отправлено сообщение на электронную почту.",
    cron: {
      time: "0 0 */1 * *",
      function: () => {
        OrderedBooks.find({})
          .populate("userId", "email firstName patronymic lastName")
          .populate("bookId", "bookInfo.title")
          .exec((err, orderedBooks) => {
            if (orderedBooks.length !== 0) {
              const todayDate = DateTime.local();

              orderedBooks.forEach(orderedBook => {
                const orderedUntilDateMinusThreeDays = DateTime.fromMillis(
                  new Date(orderedBook.orderedUntil).getTime()
                ).minus({ days: serverJson.sendEmailNDaysBeforeBookExpires });

                if (
                  todayDate.hasSame(orderedUntilDateMinusThreeDays, "day") &&
                  todayDate.hasSame(orderedUntilDateMinusThreeDays, "year") &&
                  todayDate.hasSame(orderedUntilDateMinusThreeDays, "month")
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
          });
      }
    }
  }
};

export default cronFunctions;
