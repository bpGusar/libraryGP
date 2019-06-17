import jwt from 'jsonwebtoken';

export const withAuth = function(req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;

  if (!token) {
    res.status(401).json({ errorCode: 'ERR_ACCESS_BY_TOKEN_1' });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) {
        res.status(401).json({ errorCode: 'ERR_ACCESS_BY_TOKEN_2' });
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
};
