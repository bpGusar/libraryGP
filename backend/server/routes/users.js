import express from "express";

import withAuth from "../middleware";
import UsersContr from "../../DB/controllers/Users";

import * as config from "../../DB/config";

const app = express();

app.get(
  "/api/users",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => {
    const { searchQuery } = req.query;
    UsersContr.findUsers(res, req, searchQuery);
  }
);

app.get(
  "/api/users/:login",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => {
    const { login } = req.params;
    UsersContr.findUsers(res, req, JSON.stringify({ login }));
  }
);

app.put(
  "/api/users",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => UsersContr.updateUser(req, res)
);

app.post("/api/users", (req, res) => UsersContr.addNewUser(req, res));

app.get("/api/users/service/check-reg-fields", (req, res) =>
  UsersContr.findUsers(res, req, JSON.stringify(req.query), "_id")
);

app.get("/api/users/service/:id/email-verify", (req, res) =>
  UsersContr.emailVerification(req, res)
);

app.post("/api/users/service/login", (req, res) =>
  UsersContr.logInUser(req, res)
);

/**
 * проверяет токен пользователя и если все норм то на фронт уйдет error false а если токен не валидный то error true
 * и на фронте уже можно делать манипуляции с этими данными
 */
app.get("/api/users/service/auth-status", withAuth, (req, res) =>
  res.json(config.getRespData(false, null, req.middlewareUserInfo))
);

export default app;
