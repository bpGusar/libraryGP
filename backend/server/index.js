import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import * as config from '../DB/config';
import * as UsersContr from '../DB/controllers/Users';
import Users from '../DB/models/Users';
import { withAuth } from './middleware';

const app = express();
const corsOptions = {
  origin: process.env.CORS_LINK,
  credentials: true,
};

config.setUpConnection();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.post('/api/auth/', (req, res) => {
  const { email, password } = req.body;
  Users.findOne({ email }, (err, user) => {
    if (err) {
      res.status(500).json({ errorCode: 'ERR_INTERNAL_ERR_500' });
    } else if (!user) {
      res.status(401).json({ errorCode: 'ERR_WRONG_AUTH_CRED' });
    } else {
      user.isCorrectPassword(password, function(err, same) {
        if (err) {
          res.status(500).json({
            errorCode: 'ERR_INTERNAL_ERR_500',
          });
        } else if (!same) {
          res.status(401).json({
            errorCode: 'ERR_WRONG_AUTH_CRED',
          });
        } else {
          const payload = { email };
          const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '365d',
          });
          res.cookie('token', token, { httpOnly: false }).json(user);
        }
      });
    }
  });
});

app.get('/api/checkToken', withAuth, function(req, res) {
  res.sendStatus(200);
});

app.get('/api/getUserInfo', withAuth, function(req, res) {
  Users.findOne({email: req.email}, (err, user) => {
    if (err) {
      res.status(500).json({ errorCode: 'ERR_INTERNAL_ERR_500' });
    } else if (!user) {
      res.status(401).json({ errorCode: 'ERR_WRONG_EMAIL' });
    } else {
      res.json(user);
    }
  });
});

app.post('/api/register', (req, res) => {
  UsersContr.setUserCred({
    login: 'admin',
    email: 'admin@admin.kek',
    password: '123412341234123',
    res,
  });
});

app.listen(process.env.BACK_PORT, () => {
  console.log(`Server is up and running on port ${process.env.BACK_PORT}`);
});
