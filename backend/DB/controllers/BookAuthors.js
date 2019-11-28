import _ from "lodash";
// import { parallel } from "async";

import MSG from "../../server/config/msgCodes";
import * as config from "../config";

import Authors from "../models/Authors";

function findOneAuthor(authorName, res) {
  Authors.findOne(authorName, (err, author) => {
    if (err) {
      res.json(config.getRespData(true, MSG.internalServerErr, err));
    } else if (!author) {
      res.json(
        config.getRespData(true, MSG.cantFindAuthor, {
          authorName
        })
      );
    } else {
      res.json(config.getRespData(false, null, author));
    }
  });
}

function deleteAuthor(res, req) {
  console.log(res, req);
  // const { id } = req.params;

  // parallel(
  //   {
  //     BookedBooks: cb => BookedBooks.countDocuments({ bookId: id }, cb),
  //     OrderedBooks: cb => OrderedBooks.countDocuments({ bookId: id }, cb)
  //   },
  //   (parErr, result) => {
  //     if (parErr) {
  //       res.json(config.getRespData(true, MSG.internalServerErr, parErr));
  //     } else if (result.BookedBooks !== 0 || result.OrderedBooks !== 0) {
  //       res.json(
  //         config.getRespData(true, MSG.cantDeleteBook, {
  //           bookOnHand: true,
  //           result
  //         })
  //       );
  //     } else {
  //       Book.findOne({ _id: id }, (err, book) => {
  //         if (err) {
  //           res.json(config.getRespData(true, MSG.internalServerErr, err));
  //         } else {
  //           const newArchivedBook = new BooksArchive({
  //             book,
  //             userId: req.middlewareUserInfo._id
  //           });

  //           newArchivedBook.save(bookSaveErr => {
  //             if (bookSaveErr) {
  //               res.json(
  //                 config.getRespData(
  //                   true,
  //                   MSG.cantAddNewBookToArchive,
  //                   bookSaveErr
  //                 )
  //               );
  //             }
  //           });
  //         }
  //       }).remove(err => {
  //         if (err) {
  //           res.json(config.getRespData(true, MSG.cantDeleteBook, err));
  //         } else {
  //           res.json(config.getRespData(false, MSG.bookWasDeleted));
  //         }
  //       });
  //     }
  //   }
  // );
}

function addOneAuthor(req, res) {
  const data = req.body;
  const author = new Authors({
    ...data,
    addedByUser: req.middlewareUserInfo._id
  });
  author.save((err, newAuthor) => {
    if (err) {
      if (err.code === 11000) {
        res.json(config.getRespData(true, MSG.authorMustBeUnique, err));
      } else {
        res.json(config.getRespData(true, MSG.cantAddAuthor, err));
      }
    } else {
      res.send(config.getRespData(false, null, newAuthor));
    }
  });
}

/**
 * Возвращает массив авторов
 * @param res {Object} Response
 */
function findAuthors(res, query = {}) {
  Authors.find(_.isEmpty(query) ? {} : JSON.parse(query), (err, authors) => {
    if (err) {
      res.json(config.getRespData(true, MSG.internalServerErr, err));
    } else {
      res.json(config.getRespData(false, null, authors));
    }
  });
}

export default { findOneAuthor, addOneAuthor, findAuthors, deleteAuthor };
