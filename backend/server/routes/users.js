import express from "express";

import withAuth from "../middleware";
import UsersContr from "../../DB/controllers/Users";

const app = express();

app.post("/api/getUserInfo", withAuth, (req, res) =>
  UsersContr.findUser(res, { email: req.email })
);

app.post("/api/signup", (req, res) => {
  UsersContr.addNewUser(req, res);
});

app.get("/api/doesUserWithThatCredsExist", (req, res) => {
  UsersContr.doesUserWithThatCredsExist(req, res);
});

app.get("/api/emailVerification", (req, res) => {
  UsersContr.emailVerification(req, res);
});

export default app;
