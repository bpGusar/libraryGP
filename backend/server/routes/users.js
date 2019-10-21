import express from "express";

import withAuth from "../middleware";
import UsersContr from "../../DB/controllers/Users";

import * as config from "../../DB/config";

const app = express();

app.get("/api/users", withAuth, (req, res) => UsersContr.findUsers(res));

app.get("/api/users/check-reg-fields", (req, res) => {
  UsersContr.findUsers(res, req.query, "_id");
});

app.get("/api/users/:id/email-verify", (req, res) => {
  UsersContr.emailVerification(req, res);
});

app.post("/api/users/login", (req, res) => {
  UsersContr.logInUser(req, res);
});

/**
 * проверяет токен пользователя и если все норм то на фронт уйдет error false а если токен не валидный то error true
 * и на фронте уже можно делать манипуляции с этими данными
 */
app.get("/api/users/auth-status", withAuth, (req, res) => {
  res.json(config.getRespData(false, null, req.middlewareUserInfo));
});

app.post("/api/users", (req, res) => {
  UsersContr.addNewUser(req, res);
});

export default app;
