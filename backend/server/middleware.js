import jwt from "jsonwebtoken";
import _ from "lodash";

import MSG from "../config/msgCodes";
import { getRespData } from "../DB/config";

import User from "../DB/models/User";

/**
 * Middleware функция для верификации доступа к определенным URL API.
 * @param {Object} req Express request
 * @param {Object} res Express response
 * @param {Function} next
 * @param {Array} accessRoles Роли доступа. Если не указать то будет выполнена проверка лишь на авторизацию пользователя.
 */
const withAuth = (req, res, next, accessRoles = []) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.cookies.token;

  // присутствует проверка на существование пользователя в БД и его группы
  // изза того что в local storage мог храниться валидный токен а сам пользователь из базы удален
  // могла возникать ошибка
  if (!token) {
    res.json(getRespData(true, MSG.errorToken1));
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.json(getRespData(true, MSG.errorToken2, err));
      } else {
        User.findOne({ _id: decoded._id })
          .select("-password")
          .exec((findUserErr, user) => {
            if (findUserErr) {
              res.json(getRespData(true, MSG.internalServerErr, findUserErr));
            } else if (!user) {
              res.json(getRespData(true, MSG.wrongEmail));
            } else if (
              (accessRoles.filter(el => el === user.userGroup).length !== 0 &&
                !_.isEmpty(accessRoles)) ||
              _.isEmpty(accessRoles)
            ) {
              if (user.emailVerified) {
                req.middlewareUserInfo = user;
                next();
              } else {
                res.json(getRespData(true, MSG.internalServerErr));
              }
            }
          });
      }
    });
  }
};

export default withAuth;
