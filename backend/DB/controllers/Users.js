import nodemailer from "nodemailer";

import User from "../models/User";

import * as config from "../config";
import MSG from "../../server/config/msgCodes";

import serverJson from "../../server/config/server.json";

import { EmailVerifyTemplate } from "../../server/emailTemplates/EmailVerify";

const transporter = nodemailer.createTransport(serverJson.emailConfig);

function findUser(res, query) {
  User.findOne({ ...query })
    .select("-password")
    .select("-emailVerified")
    .exec((err, user) => {
      if (err) {
        res.json(config.getRespData(true, MSG.internalServerErr, err));
      } else if (!user) {
        res.json(config.getRespData(true, MSG.wrongEmail));
      } else {
        res.json(config.getRespData(false, null, user));
      }
    });
}

function addNewUser(req, res) {
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
}

function doesUserWithThatCredsExist(req, res) {
  User.findOne(req.query, (err, user) => {
    if (err) {
      res.json(config.getRespData(true, MSG.internalServerErr, err));
    } else if (!user) {
      res.json(config.getRespData(false, MSG.thisCredsAreFree));
    } else {
      res.json(config.getRespData(true, MSG.weFindSameCreds));
    }
  });
}

function emailVerification(req, res) {
  const { verifyToken } = req.query;
  User.findOne({ _id: verifyToken }, (findOneError, user) => {
    if (findOneError) {
      res.json(config.getRespData(true, MSG.internalServerErr, findOneError));
    } else if (!user) {
      res.json(config.getRespData(false, MSG.thisCredsAreFree));
    } else if (!user.emailVerified) {
      User.findOneAndUpdate(
        { _id: verifyToken },
        { emailVerified: true },
        err => {
          if (err) {
            res.json(config.getRespData(true, MSG.internalServerErr, err));
          } else {
            res.json(config.getRespData(false, MSG.emailSuccessfullyVerified));
          }
        }
      );
    } else {
      res.json(config.getRespData(true, MSG.emailAlreadyVerified));
    }
  });
}

export default {
  findUser,
  addNewUser,
  doesUserWithThatCredsExist,
  emailVerification
};
