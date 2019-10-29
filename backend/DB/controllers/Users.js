import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs-extra";
import _ from "lodash";

import User from "../models/User";

import * as config from "../config";
import MSG from "../../server/config/msgCodes";

import servConf from "../../server/config/server.json";

import { EmailVerifyTemplate } from "../../server/emailTemplates/EmailVerify";

const transporter = nodemailer.createTransport(servConf.emailConfig);

function logInUser(req, res) {
  const { email: reqEmail, password, rememberMe } = req.body;
  User.findOne({ email: reqEmail }, (err, user) => {
    if (err) {
      res.json(config.getRespData(true, MSG.internalServerErr, err));
    } else if (!user) {
      res.json(config.getRespData(true, MSG.wrongAuthCred));
    } else if (user.emailVerified) {
      user.isCorrectPassword(
        password,
        user.password,
        (incorrectPassERR, same) => {
          if (incorrectPassERR) {
            res.json(
              config.getRespData(true, MSG.internalServerErr, incorrectPassERR)
            );
          } else if (!same) {
            res.json(config.getRespData(true, MSG.wrongAuthCred));
          } else {
            const { _id } = user;
            const payload = { _id };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
              expiresIn: rememberMe ? "365d" : "1d"
            });
            res.json(config.getRespData(false, null, token));
          }
        }
      );
    } else {
      res.json(config.getRespData(true, MSG.userFoundButNotVerified));
    }
  });
}

function findUsers(res, query = {}, selectParams = "") {
  User.find(query)
    .select(selectParams === "" ? "-password -emailVerified" : selectParams)
    .exec((err, users) => {
      if (err) {
        res.json(config.getRespData(true, MSG.internalServerErr, err));
      } else if (!users) {
        res.json(config.getRespData(true, MSG.cantFindUser));
      } else {
        res.json(config.getRespData(false, null, users));
      }
    });
}

function addNewUser(req, res) {
  const { send_email, regData } = req.body;

  const posterName = `avatar_${Date.now()}.png`;

  const pathToNewAvatar = path.join(
    __dirname,
    `../../server/${servConf.filesPaths.avatars.mainFolder}`,
    posterName
  );

  const saveUser = userData => {
    const UserModel = new User({
      ...userData
    });

    UserModel.save((saveError, newUser) => {
      if (saveError) {
        res.json(config.getRespData(true, MSG.registrationError, saveError));
      } else if (
        (!_.isUndefined(send_email) && send_email) ||
        _.isUndefined(send_email)
      ) {
        transporter.sendMail(
          EmailVerifyTemplate(userData.email, process.env, newUser._id),
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
      } else if (!send_email) {
        res.send(config.getRespData(false));
      }
    });
  };

  let clonedUserObj = { ...regData };

  if (!send_email) {
    clonedUserObj = {
      ...clonedUserObj,
      emailVerified: true
    };
  }

  if (clonedUserObj.avatar === "") {
    clonedUserObj.avatar = `${servConf.filesPaths.placeholders.urlToPlaceholder}/imagePlaceholder.png`;

    saveUser(clonedUserObj);
  } else {
    const base64Poster = clonedUserObj.avatar.replace(
      /^data:image\/png;base64,/,
      ""
    );

    fs.writeFile(pathToNewAvatar, base64Poster, "base64", err => {
      if (err) {
        res.json(config.getRespData(true, MSG.cantAddNewBook, err));
      } else {
        clonedUserObj.avatar = `${servConf.filesPaths.avatars.urlToAvatar}/${posterName}`;

        saveUser(clonedUserObj);
      }
    });
  }
}

function emailVerification(req, res) {
  const { id } = req.params;
  User.findOne({ _id: id }, (findOneError, user) => {
    if (findOneError) {
      res.json(config.getRespData(true, MSG.internalServerErr, findOneError));
    } else if (!user) {
      res.json(config.getRespData(true, MSG.cantFindUser));
    } else if (!user.emailVerified) {
      User.findOneAndUpdate({ _id: id }, { emailVerified: true }, err => {
        if (err) {
          res.json(config.getRespData(true, MSG.internalServerErr, err));
        } else {
          res.json(config.getRespData(false, MSG.emailSuccessfullyVerified));
        }
      });
    } else {
      res.json(config.getRespData(true, MSG.emailAlreadyVerified));
    }
  });
}

export default {
  findUsers,
  addNewUser,
  emailVerification,
  logInUser
};
