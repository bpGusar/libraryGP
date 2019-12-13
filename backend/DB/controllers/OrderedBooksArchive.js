import parallel from "async/parallel";
import _ from "lodash";

import MSG from "../../server/config/msgCodes";
import * as config from "../config";

import OrderedBooksArchive from "../models/OrderedBooksArchive";
import OrderedBooks from "../models/OrderedBooks";
import Book from "../models/Book";

function bookReturn(req, res) {
  const returnComment = req.body.comment;
  const orderedBookId = req.params.id;

  OrderedBooks.find({ _id: orderedBookId }, (findOBerr, orderedBook) => {
    if (findOBerr) {
      res.json(config.getRespData(true, MSG.internalServerErr, findOBerr));
    } else {
      parallel(
        {
          deleteBookedBook: cb =>
            OrderedBooks.deleteOne(
              {
                bookId: orderedBook[0].bookId,
                userId: orderedBook[0].userId
              },
              cb
            ),
          findOneAndUpdateBook: cb =>
            Book.findOneAndUpdate(
              { _id: orderedBook[0].bookId },
              {
                $inc: { "stockInfo.freeForBooking": 1 }
              },
              { new: true },
              cb
            )
        },
        parErr => {
          if (parErr) {
            res.json(config.getRespData(true, MSG.internalServerErr, parErr));
          } else {
            const newArchivedOrder = new OrderedBooksArchive({
              comment: returnComment,
              orderedBookInfo: {
                bookId: orderedBook[0].bookId,
                userId: orderedBook[0].userId,
                orderedAt: orderedBook[0].orderedAt,
                orderedUntil: orderedBook[0].orderedUntil
              },
              userId: req.middlewareUserInfo._id
            });

            newArchivedOrder.save(saveErr => {
              if (saveErr) {
                res.json(
                  config.getRespData(true, MSG.internalServerErr, saveErr)
                );
              } else {
                res.send(config.getRespData(false, null));
              }
            });
          }
        }
      );
    }
  });
}

/**
 * Функция поиска книг в архиве выданных.
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
 * @param {Boolean} useParse Используется для определения необходимо ли парсить данные из JSON.
 *
 * @param {Object} options Объект с опциями поиска. Будет задан данными по умолчанию при полном отсутствии.
 * @param {Number} options.fetch_type Вид возвращаемых данных. По умолчанию `0`.
 *
 * `0` - вернуть данные по выдаче книги с данными по книге как есть (прим.: авторы будут возвращены в виде массива id и т.д. смотри модель `Book`).
 *
 * `1` - вернуть данные по выдаче книги с данными по книге и заполнить данными объекты, в которых изначально есть только id (смотри модель `Book`)).
 *
 * `2` - вернуть данные по выдаче книги как есть.
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
 * `options` Все опции запроса.
 */
function findBooks(req, res, data = {}, useParse = true) {
  let { options } = req.query;

  if (_.isUndefined(options)) {
    options = {
      page: 1,
      limit: 99,
      fetch_type: 0,
      sort: "desc"
    };
  } else {
    options = JSON.parse(options);
  }

  options.page = _.isUndefined(options.page) ? 1 : options.page;
  options.sort = _.isUndefined(options.sort) ? 1 : options.sort;
  options.limit = _.isUndefined(options.limit) ? 99 : options.limit;
  options.fetch_type = _.isUndefined(options.fetch_type)
    ? 0
    : options.fetch_type;

  const getSkip = () => {
    if (options.page === 1) {
      return 0;
    }
    return options.limit * (options.page - 1);
  };

  const fetchTypes = {
    0: [
      {
        path: "orderedBookInfo.bookId"
      },
      {
        path: "orderedBookInfo.userId",
        select: "-password -emailVerified -userGroup -createdAt -readerId"
      }
    ],
    1: [
      {
        path: "orderedBookInfo.userId",
        select: "-password -emailVerified -userGroup -createdAt -readerId"
      },
      {
        path: "orderedBookInfo.bookId",
        populate: {
          path:
            "bookInfo.authors bookInfo.categories bookInfo.publisher bookInfo.language"
        }
      }
    ],
    2: ""
  };

  const queryData = useParse ? JSON.parse(data) : data;

  OrderedBooksArchive.countDocuments(
    _.isEmpty(data) ? {} : queryData,
    (countError, count) => {
      res.set({
        "max-elements": count,
        ...options
      });
      OrderedBooksArchive.find(_.isEmpty(data) ? {} : queryData)
        .sort({ createdAt: options.sort })
        .skip(getSkip())
        .limit(options.limit)
        .populate(fetchTypes[options.fetch_type])
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

export default { bookReturn, findBooks };
