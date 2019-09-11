import express from "express";

import withAuth from "../middleware";

import * as config from "../../DB/config";
import MSG from "../config/msgCodes";

import Users from "../../DB/models/Users";

const app = express();

app.post("/api/getUserInfo", withAuth, (req, res) =>
  Users.findOne({ email: req.email }, (err, user) => {
    if (err) {
      res.json(config.getRespData(true, MSG.internalErr500, err));
    } else if (!user) {
      res.json(config.getRespData(true, MSG.wrongEmail));
    } else {
      res.json(
        config.getRespData(false, null, {
          // eslint-disable-next-line no-underscore-dangle
          user: { login: user.login, role: user.userGroup, id: user._id }
        })
      );
    }
  })
);

app.post("/api/register", withAuth, (req, res) => {
  const { login, email, password, userGroup } = req.body;
  const user = new Users({ login, email, password, userGroup });
  user.save(err => {
    if (err) {
      res.json(config.getRespData(true, MSG.registrationError, err));
    } else {
      res.send(config.getRespData(false));
    }
  });
});

export default app;
