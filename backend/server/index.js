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
import Authors from "../DB/models/Authors";
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
      res.json(config.getRespData(true, MSG.internalErr500, err));
    } else if (!user) {
      res.json(config.getRespData(true, MSG.wrongAuthCred));
    } else {
      user.isCorrectPassword(
        password,
        user.password,
        (incorrectPassERR, same) => {
          if (incorrectPassERR) {
            res.json(
              config.getRespData(true, MSG.internalErr500, incorrectPassERR)
            );
          } else if (!same) {
            res.json(config.getRespData(true, MSG.wrongAuthCred));
          } else {
            const { email: userEmail, userGroup } = user;
            const payload = { email: userEmail, userGroup };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
              expiresIn: rememberMe ? "365d" : "1d"
            });
            res.json(config.getRespData(false, null, token));
          }
        }
      );
    }
  });
});

app.post("/api/findAuthor/", (req, res) => {
  Authors.findOne({ authorName: req.body.authorName }, (err, author) => {
    if (err) {
      res.json(config.getRespData(true, MSG.internalErr500, err));
    } else if (!author) {
      res.json(
        config.getRespData(true, MSG.cantFindAuthor, {
          authorName: req.body.authorName
        })
      );
    } else {
      res.json(config.getRespData(false, null, author));
    }
  });
});

app.get("/api/getAuthors/", (req, res) => {
  Authors.find({}, (err, author) => {
    if (err) {
      res.json(config.getRespData(true, MSG.internalErr500, err));
    } else {
      res.json(config.getRespData(false, null, author));
    }
  });
});

app.post("/api/checkAuth", withAuth, (req, res) => {
  res.json(config.getRespData(false));
});

app.post("/api/getUserInfo", withAuth, (req, res) => {
  Users.findOne({ email: req.email }, (err, user) => {
    if (err) {
      res.json(config.getRespData(true, MSG.internalErr500, err));
    } else if (!user) {
      res.json(config.getRespData(true, MSG.wrongEmail));
    } else {
      res.json(
        config.getRespData(false, null, {
          user: { login: user.login, role: user.userGroup }
        })
      );
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
      res.json(config.getRespData(true, MSG.internalErr500, err));
    } else if (!menu) {
      res.json(config.getRespData(true, MSG.cannotFindMenu));
    } else {
      res.json(config.getRespData(false, null, menu));
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
      res.json(config.getRespData(true, MSG.cannotUpdateMenu, err));
    } else {
      res.json(config.getRespData(false, MSG.menuWasUpdated));
    }
  });
});

app.listen(process.env.BACK_PORT, () => {
  console.log(`Server is up and running on port ${process.env.BACK_PORT}`);
});
