import express from "express";
import nodemailer from "nodemailer";

import withAuth from "../middleware";

import * as config from "../../DB/config";
import MSG from "../config/msgCodes";

import User from "../../DB/models/User";

import serverJson from "../config/server.json";

import { EmailVerifyTemplate } from "../emailTemplates/EmailVerify";

const app = express();

const transporter = nodemailer.createTransport(serverJson.emailConfig);

app.post("/api/getUserInfo", withAuth, (req, res) =>
  User.findOne({ email: req.email }, (err, user) => {
    if (err) {
      res.json(config.getRespData(true, MSG.internalErr500, err));
    } else if (!user) {
      console.log(user);
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

app.post("/api/signup", (req, res) => {
  const { email, password, login, firstName, lastName, patronymic } = req.body;
  const UserModel = new User({
    email,
    password,
    login,
    firstName,
    lastName,
    patronymic
  });
  UserModel.save((saveError, newUser) => {
    if (saveError) {
      res.json(config.getRespData(true, MSG.registrationError, saveError));
    } else {
      transporter.sendMail(
        EmailVerifyTemplate(email, process.env, newUser._id),
        function(emailSentError) {
          if (emailSentError) {
            User.find({ _id: newUser._id }).remove();
            res.json(
              config.getRespData(true, MSG.registrationError, {
                saveError,
                emailSentError
              })
            );
          } else {
            res.send(config.getRespData(false));
          }
        }
      );
    }
  });
});

app.get("/api/doesUserWithThatCredsExist", (req, res) => {
  User.findOne(req.query, (err, user) => {
    if (err) {
      res.json(config.getRespData(true, MSG.internalErr500, err));
    } else if (!user) {
      res.json(config.getRespData(false, MSG.thisCredsAreFree));
    } else {
      res.json(config.getRespData(true, MSG.weFindSameCreds));
    }
  });
});

app.get("/api/emailVerification", (req, res) => {
  const { verifyToken } = req.query;
  User.findOne({ _id: verifyToken }, (findOneError, user) => {
    if (findOneError) {
      res.json(config.getRespData(true, MSG.internalErr500, findOneError));
    } else if (!user) {
      res.json(config.getRespData(false, MSG.thisCredsAreFree));
    } else if (!user.emailVerified) {
      User.findOneAndUpdate(
        { _id: verifyToken },
        { emailVerified: true },
        err => {
          if (err) {
            res.json(config.getRespData(true, MSG.internalErr500, err));
          } else {
            res.json(config.getRespData(false, MSG.emailSuccessfullyVerified));
          }
        }
      );
    } else {
      res.json(config.getRespData(true, MSG.emailAlreadyVerified));
    }
  });
});

export default app;
