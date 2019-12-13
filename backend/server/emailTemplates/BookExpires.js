import servConf from "../../config/server.json";
import * as utils from "../utils";

// eslint-disable-next-line import/prefer-default-export
export const BookExpiresTemplate = orderedBook => {
  return {
    from: "libraryGPbot@libraryGP.com",
    to: orderedBook.userId.email,
    subject: `LibraryGP. Уведомление о истечении срока нахождения книги на руках. (чит. бил. №${orderedBook.readerId})`,
    text: `${orderedBook.userId.lastName} ${orderedBook.userId.firstName} ${
      orderedBook.userId.patronymic
    } (чит. бил. №${orderedBook.readerId}) уведомляем вас что у книги ${
      orderedBook.bookId.bookInfo.title
    } через ${
      servConf.sendEmailNDaysBeforeBookExpires
    } дня истекает срок нахождения на руках. Вам необходимо вернуть книгу в библиотеку ${utils.convertDate(
      orderedBook.orderedUntil
    )}.`
  };
};
