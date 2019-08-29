import express from "express";
import jwt from "jsonwebtoken";

import withAuth from "../middleware";

import * as config from "../../DB/config";
import { MSG } from "../../../config/msgCodes";

import Users from "../../DB/models/Users";

const app = express();

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

app.post("/api/checkAuth", withAuth, (req, res) => {
  res.json(config.getRespData(false));
});

export default app;
