import parallel from "async/parallel";
import _ from "lodash";

import MSG from "../../config/msgCodes";
import * as config from "../config";

import BookedBooksArchive from "../models/BookedBooksArchive";
import BookedBooks from "../models/BookedBooks";
import Book from "../models/Book";
import User from "../models/User";

function rejectOrdering(req, res) {
  const bookedBookData = req.body;
  parallel(
    {
      bookData: cb =>
        Book.find({ _id: bookedBookData.bookedBookInfo.bookId })
          .populate([
            {
              path: "bookInfo.authors"
            },
            {
              path: "bookInfo.categories"
            },
            {
              path: "bookInfo.publisher"
            },
            {
              path: "bookInfo.language"
            }
          ])
          .exec(cb),
      userData: cb =>
        User.find({ _id: bookedBookData.bookedBookInfo.userId })
          .select("-password -emailVerified")
          .exec(cb),
      deleteBookedBook: cb =>
        BookedBooks.deleteOne(
          {
            bookId: bookedBookData.bookedBookInfo.bookId,
            userId: bookedBookData.bookedBookInfo.userId
          },
          cb
        ),
      findOneAndUpdateBook: cb =>
        Book.findOneAndUpdate(
          { _id: bookedBookData.bookedBookInfo.bookId },
          {
            $inc: { "stockInfo.freeForBooking": 1 }
          },
          { new: true },
          cb
        )
    },
    (parErr, result) => {
      if (parErr) {
        res.json(config.getRespData(true, MSG.internalServerErr, parErr));
      } else {
        const newArchivedReservation = new BookedBooksArchive({
          ...bookedBookData,
          bookedBookInfo: {
            bookInfo: result.bookData[0],
            userInfo: result.userData[0],
            createdAt: bookedBookData.bookedBookInfo.createdAt
          },
          userId: req.middlewareUserInfo._id
        });

        newArchivedReservation.save(saveErr => {
          if (saveErr) {
            res.json(config.getRespData(true, MSG.internalServerErr, saveErr));
          } else {
            res.send(config.getRespData(false));
          }
        });
      }
    }
  );
}

/**
 * Функция поиска книг в архиве арендованных.
 *
 * Express параметры:
 * @param {Object} res Response
 * @param {Object} req Request
 *
 * Параметры запроса:
 * @param {Object} data Данные для поиска нужной книги или книг.
 * Если `{}` то будут отданы все книги.
 * Если например `{ _id: id_книги }` то будет найдена именно книга с указанным `_id`.
 * Кейсы по составлению запросов к MongoDB можно загуглить.
 * Запросы делаются напрямую в базу, поэтому необходимо валидно составлять объект запроса.
 *
 * @param {Boolean} useParse Используется для определения нужно ли парсить данные из JSON.
 *
 * @param {Object} options Объект с опциями поиска. Будет задан данными по умолчанию при полном отсутствии.
 * @param {Number} options.fetch_type Вид возвращаемых данных. По умолчанию `0`.
 *
 * `0` - вернуть данные по аренде с данными по книге как есть (прим.: авторы будут возвращены в виде массива id и т.д. смотри модель `Book`).
 *
 * `1` - вернуть данные по аренде с данными по книге и заполнить данными объекты, в которых изначально есть только id (смотри модель `Book`)).
 *
 * `2` - вернуть данные по аренде как есть.
 *
 * @param {Number} options.page Номер страницы выборки. По умолчанию `1`.
 * @param {String} options.sort Сортировка. По умолчанию `desc`.
 * @param {Number} options.limit Количество элементов в одной выборке. За 1 раз не более 99 элементов. По умолчанию `99`.
 *
 * ВНИМАНИЕ!
 * `options.limit` по умолчанию `99`. Если не указать `options.limit` но при этом указать `options.page`, то, если в базе элементов будет меньше `99`-ти то поиск не даст результатов!
 *
 * Возвращаемые хедеры:
 *
 * `max-elements` Количество элементов в базе, подходящих под запрос.
 */
function findBooks(req, res, data = {}, useParse = true) {
  let { options } = req.query;

  if (_.isUndefined(options)) {
    options = {
      page: 1,
      limit: 99,
      sort: "desc"
    };
  } else {
    options = JSON.parse(options);
  }

  options.page = _.isUndefined(options.page) ? 1 : options.page;
  options.sort = _.isUndefined(options.sort) ? 1 : options.sort;
  options.limit = _.isUndefined(options.limit) ? 99 : options.limit;

  const getSkip = () => {
    if (options.page === 1) {
      return 0;
    }
    return options.limit * (options.page - 1);
  };

  const queryData = useParse ? JSON.parse(data) : data;

  BookedBooksArchive.countDocuments(
    _.isEmpty(data) ? {} : queryData,
    (countError, count) => {
      res.set({
        "max-elements": count,
        ...options
      });
      BookedBooksArchive.find(_.isEmpty(data) ? {} : queryData)
        .sort({ createdAt: options.sort })
        .skip(getSkip())
        .limit(options.limit)
        .exec((findBookError, books) => {
          if (findBookError) {
            res.json(config.getRespData(true, MSG.bookNotFound, findBookError));
          } else {
            res.json(config.getRespData(false, null, books));
          }
        });
    }
  );
}

export default { rejectOrdering, findBooks };
