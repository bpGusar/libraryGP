import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { MSG } from "../../config/msgCodes";

import * as config from "../DB/config";

import * as UsersContr from "../DB/controllers/Users";

import Users from "../DB/models/Users";
import Menu from "../DB/models/Menu";

import withAuth from "./middleware";

const app = express();
const corsOptions = {
  origin: process.env.CORS_LINK,
  credentials: true
};

config.setUpConnection();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.post("/api/auth/", (req, res) => {
  const { email: bodyEmail, password, rememberMe } = req.body;
  Users.findOne({ email: bodyEmail }, (err, user) => {
    if (err) {
      res.status(500).json({ msg: config.getMsgByCode(MSG.internalErr500) });
    } else if (!user) {
      res
        .status(401)
        .json({ msg: config.getMsgByCode(MSG.ERR_WRONG_AUTH_CRED) });
    } else {
      user.isCorrectPassword(
        password,
        user.password,
        (incorrectPassERR, same) => {
          if (incorrectPassERR) {
            res.status(500).json({
              msg: config.getMsgByCode(MSG.internalErr500)
            });
          } else if (!same) {
            res.status(401).json({
              msg: config.getMsgByCode(MSG.wrongAuthCred)
            });
          } else {
            const { email: userEmail, userGroup } = user;
            const payload = { email: userEmail, userGroup };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
              expiresIn: rememberMe ? "365d" : "1d"
            });
            res.json({ token });
          }
        }
      );
    }
  });
});

app.post("/api/checkAuth", withAuth, (req, res) => {
  res.sendStatus(200);
});

app.post("/api/getUserInfo", withAuth, (req, res) => {
  Users.findOne({ email: req.email }, (err, user) => {
    if (err) {
      res.status(500).json({ msg: config.getMsgByCode(MSG.internalErr500) });
    } else if (!user) {
      res.status(401).json({ msg: config.getMsgByCode(MSG.wrongEmail) });
    } else {
      res.json({ user: { login: user.login, role: user.userGroup } });
    }
  });
});

app.post("/api/register", (req, res) => {
  UsersContr.setUserCred({
    login: "admins",
    email: "admin@admin.kekы",
    password: "123412341234123",
    userGroup: 2,
    res
  });
});

app.post("/api/getMenu", (req, res) => {
  Menu.findOne({ email: req.menuId }, (err, menu) => {
    if (err) {
      res
        .status(500)
        .json({ msg: config.getMsgByCode(MSG.internalErr500), err });
    } else if (!menu) {
      res.status(401).json({ msg: config.getMsgByCode(MSG.cannotFindMenu) });
    } else {
      res.json(menu);
    }
  });
});

app.put("/api/menu", (req, res) => {
  const newmenu = {
    menu: {
      always: [
        {
          to: "/",
          name: "Главная"
        }
      ],
      authorized: [
        {
          to: "/secret",
          name: "Секрет"
        },
        {
          to: "/346345634",
          name: "34563456345"
        }
      ],
      onlyNotAuthorized: [
        {
          to: "/login",
          name: "Вход"
        }
      ]
    }
  };
  Menu.update({ _id: "5d0cdd7669529541dc73e657" }, { ...newmenu }, err => {
    if (err) {
      res.json({ msg: config.getMsgByCode(MSG.cannotUpdateMenu), err });
    } else {
      res.json({ msg: config.getMsgByCode(MSG.menuWasUpdated) });
    }
  });
});

app.listen(process.env.BACK_PORT, () => {
  console.log(`Server is up and running on port ${process.env.BACK_PORT}`);
});
