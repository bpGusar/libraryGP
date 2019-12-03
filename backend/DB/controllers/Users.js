import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs-extra";
import _ from "lodash";
import uniqid from "uniqid";

import User from "../models/User";

import * as config from "../config";
import MSG from "../../server/config/msgCodes";

import servConf from "../../server/config/server.json";

import { EmailVerifyTemplate } from "../../server/emailTemplates/EmailVerify";
import { ResetPasswordEmail } from "../../server/emailTemplates/ResetPassword";

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

function findUsers(res, req, query = {}, selectParams = "") {
  let { options } = req.query;

  if (_.isUndefined(options)) {
    options = {
      page: 1,
      limit: 99,
      sort: "desc"
    };
  } else {
    options = JSON.parse(options);
  }

  options.page = _.isUndefined(options.page) ? 1 : options.page;
  options.sort = _.isUndefined(options.sort) ? 1 : options.sort;
  options.limit = _.isUndefined(options.limit) ? 99 : options.limit;

  const getSkip = () => {
    if (options.page === 1) {
      return 0;
    }
    return options.limit * (options.page - 1);
  };

  User.countDocuments(
    _.isEmpty(query) ? {} : JSON.parse(query),
    (countError, count) => {
      res.set({
        "max-elements": count,
        ...options
      });
      User.find(_.isEmpty(query) ? {} : JSON.parse(query))
        .select(selectParams === "" ? "-password -emailVerified" : selectParams)
        .sort({ createdAt: options.sort })
        .skip(getSkip())
        .limit(options.limit)
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
  );
}

function updateUser(req, res) {
  const { middlewareUserInfo } = req;
  const { updateData, send_email } = req.body;

  if (
    middlewareUserInfo.userGroup !== 1 &&
    middlewareUserInfo._id !== updateData._id
  ) {
    res.json(
      config.getRespData(true, MSG.userUpdateError, "Это ваще законно?")
    );
    return;
  }

  if ((!_.isUndefined(send_email) && send_email) || _.isUndefined(send_email)) {
    updateData.emailVerified = false;
  }

  let clonedUserData = _.cloneDeep(updateData);
  const detectNewAvatar = clonedUserData.avatar.search("base64");

  const saveUser = user => {
    User.updateOne({ _id: user._id }, { ...user }, err => {
      if (err) {
        res.json(config.getRespData(true, MSG.userUpdateError, err));
      } else if (
        (!_.isUndefined(send_email) && send_email) ||
        _.isUndefined(send_email)
      ) {
        transporter.sendMail(
          EmailVerifyTemplate(updateData.email, process.env, updateData._id),
          function(emailSentError) {
            if (emailSentError) {
              res.json(
                config.getRespData(true, MSG.userUpdateError, emailSentError)
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

  if (send_email) {
    clonedUserData = {
      ...clonedUserData,
      emailVerified: false
    };
  }

  if (clonedUserData.avatar === "") {
    clonedUserData.avatar = `${servConf.filesPaths.placeholders.urlToPlaceholder}/imagePlaceholder.png`;

    saveUser(clonedUserData);
  } else if (detectNewAvatar !== -1) {
    const base64Poster = clonedUserData.avatar.replace(
      /^data:image\/png;base64,/,
      ""
    );
    const avatarName = `avatar_${Date.now()}.png`;
    const pathToNewAvatar = path.join(
      __dirname,
      `../../server/${servConf.filesPaths.avatars.mainFolder}`,
      avatarName
    );

    fs.writeFile(pathToNewAvatar, base64Poster, "base64", err => {
      if (err) {
        res.json(config.getRespData(true, MSG.cantAddNewBook, err));
      } else {
        clonedUserData.avatar = `${servConf.filesPaths.avatars.urlToAvatar}/${avatarName}`;

        saveUser(clonedUserData);
      }
    });
  } else {
    saveUser(clonedUserData);
  }
}

function addNewUser(req, res) {
  const { send_email, regData } = req.body;

  const avatarName = `avatar_${Date.now()}.png`;

  const pathToNewAvatar = path.join(
    __dirname,
    `../../server/${servConf.filesPaths.avatars.mainFolder}`,
    avatarName
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
        clonedUserObj.avatar = `${servConf.filesPaths.avatars.urlToAvatar}/${avatarName}`;

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

function resetPassword(req, res) {
  const { email } = req.body;

  const newPassword = uniqid();
  User.findOne({ email }, (findOneError, user) => {
    if (findOneError) {
      res.json(config.getRespData(true, MSG.internalServerErr, findOneError));
    } else if (!user) {
      res.json(config.getRespData(true));
    } else {
      User.updateOne({ email }, { password: newPassword }, err => {
        if (err) {
          res.json(config.getRespData(true, MSG.userUpdateError, err));
        } else {
          transporter.sendMail(ResetPasswordEmail(email, newPassword), function(
            emailSentError
          ) {
            if (emailSentError) {
              res.json(
                config.getRespData(true, MSG.internalServerErr, emailSentError)
              );
            } else {
              res.send(config.getRespData(false));
            }
          });
        }
      });
    }
  });
}

export default {
  findUsers,
  addNewUser,
  emailVerification,
  logInUser,
  updateUser,
  resetPassword
};
