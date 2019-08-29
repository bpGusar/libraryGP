import express from "express";

import withAuth from "../middleware";

import * as config from "../../DB/config";
import { MSG } from "../../../config/msgCodes";

import Users from "../../DB/models/Users";

import * as UsersContr from "../../DB/controllers/Users";

const app = express();

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

app.post("/api/register", withAuth, (req, res) => {
  UsersContr.setUserCred({
    login: "admins",
    email: "admin@admin.kekы",
    password: "123412341234123",
    userGroup: 2,
    res
  });
});

export default app;
