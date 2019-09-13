import jwt from "jsonwebtoken";

import MSG from "./config/msgCodes";
import { getRespData } from "../DB/config";

const withAuth = (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.cookies.token;
  // TODO: сделать проверку доступа на основе списка разрешенных URL из базы данных

  if (!token) {
    res.json(getRespData(true, MSG.errorToken1));
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.json(getRespData(true, MSG.errorToken2, err));
      } else {
        req.email = decoded.email;
        req.accessRole = decoded.userGroup;
        next();
      }
    });
  }
};

export default withAuth;
