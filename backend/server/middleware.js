import jwt from "jsonwebtoken";

import MSG from "./config/msgCodes";
import { getRespData } from "../DB/config";

import User from "../DB/models/User";

const withAuth = (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.cookies.token;
  // TODO: сделать проверку доступа на основе списка разрешенных URL из базы данных

  // присутствует проверка на существование пользователя в БД
  // изза того что в local storage мог храниться валидный токен а сам пользователь из базы удален
  // могла возникать ошибка
  if (!token) {
    res.json(getRespData(true, MSG.errorToken1));
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.json(getRespData(true, MSG.errorToken2, err));
      } else {
        User.findOne({ email: decoded.email }, (findUserErr, user) => {
          if (findUserErr) {
            res.json(getRespData(true, MSG.internalErr500, findUserErr));
          } else if (!user) {
            res.json(getRespData(true, MSG.wrongEmail));
          } else {
            req.email = decoded.email;
            req.accessRole = decoded.userGroup;
            next();
          }
        });
      }
    });
  }
};

export default withAuth;
