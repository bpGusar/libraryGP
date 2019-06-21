import jwt from 'jsonwebtoken';

import { MSG } from '../../config/msgCodes';
import { getMsgByCode } from '../DB/config';

export const withAuth = function(req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;

  if (!token) {
    res.status(401).json({ msg: getMsgByCode(MSG.errorToken1) });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) {
        res.status(401).json({ msg: getMsgByCode(MSG.errorToken2), err });
      } else {
        req.email = decoded.email;
        req.accessRole = decoded.userGroup;
        next();
      }
    });
  }
};
