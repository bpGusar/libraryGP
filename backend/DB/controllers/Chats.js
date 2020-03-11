import _ from "lodash";
import { parallel } from "async";

import Chats from "../models/Chats";
import User from "../models/User";
import MSG from "../../config/msgCodes";
import * as config from "../config";

function getChats(req, res) {
  const { middlewareUserInfo } = req;
  Chats.find({ members: { $in: [_.toString(middlewareUserInfo._id)] } })
    .select("-messages")
    .sort({
      lastMessage: -1
    })
    .populate([
      {
        path: "members",
        select:
          "-password -emailVerified -userGroup -createdAt -readerId -email -login"
      }
    ])
    .exec((err, fondedChats) => {
      const chatsArr = fondedChats.map(chat => ({
        _id: chat._id,
        createdAt: chat.createdAt,
        peer: chat.members.find(
          member =>
            _.toString(member._id) !== _.toString(middlewareUserInfo._id)
        ),
        lastMessage: chat.lastMessage
      }));

      if (err) {
        res.json(config.getRespData(true, MSG.cantLoadChatList, err));
      } else {
        res.json(config.getRespData(false, MSG.chatListFetched, chatsArr));
      }
    });
}

function getChatMessages(req, res) {
  const {
    middlewareUserInfo,
    query: { toId },
    io
  } = req;

  let { options } = req.query;

  if (_.isUndefined(options)) {
    options = {
      page: 1,
      limit: 99,
      fetch_type: 0,
      sort: "desc",
      displayMode: "all"
    };
  } else {
    options = JSON.parse(options);
  }

  options.page = _.isUndefined(options.page) ? 1 : options.page;
  options.limit = _.isUndefined(options.limit) ? 25 : options.limit;

  const getSkip = () => {
    if (options.page === 1) {
      return options.limit;
    }
    return options.limit * options.page;
  };

  parallel(
    {
      foundedChatMessages: cb =>
        Chats.findOne({
          members: {
            $in: [_.toString(middlewareUserInfo._id), _.toString(toId)]
          }
        })
          .select("messages")
          .slice("messages", [-getSkip(), options.limit])
          .exec(cb),
      countAllMessages: cb =>
        Chats.aggregate()
          .match({
            members: {
              $in: [_.toString(middlewareUserInfo._id), _.toString(toId)]
            }
          })
          .project({
            messages: { $size: "$messages" }
          })
          .exec(cb)
    },
    (parErr, result) => {
      if (parErr) {
        res.json(config.getRespData(true, MSG.cantUpdateSettings, parErr));
      } else {
        res.set({
          "max-elements": result.countAllMessages[0].messages
        });
        res.json(
          config.getRespData(
            false,
            MSG.settingsWasUpdated,
            result.foundedChatMessages
          )
        );
      }
    }
  );
}

function postNewMessage(req, res) {
  const { body, io, middlewareUserInfo } = req;

  parallel(
    {
      findExistingChat: cb =>
        Chats.countDocuments(
          {
            members: {
              $in: [_.toString(middlewareUserInfo._id), _.toString(body.toId)]
            }
          },
          cb
        )
    },
    (parErr, result) => {
      if (parErr) {
        res.json(config.getRespData(true, MSG.internalServerErr, parErr));
      } else if (result.findExistingChat !== 0) {
        Chats.findOneAndUpdate(
          {
            members: {
              $in: [_.toString(middlewareUserInfo._id), _.toString(body.toId)]
            }
          },
          {
            lastMessage: {
              message: body.message,
              from: middlewareUserInfo._id,
              createdAt: Date.now()
            },
            $push: {
              messages: {
                message: body.message,
                from: middlewareUserInfo._id,
                createdAt: Date.now()
              }
            }
          },
          { new: true },
          (err, updatedChat) => {
            if (err) {
              res.json(config.getRespData(true, MSG.cantUpdatePost, err));
            } else {
              User.findOne({ _id: middlewareUserInfo._id })
                .select(
                  "-password -emailVerified -userGroup -createdAt -readerId -email -login"
                )
                .exec((err, user) => {
                  io.sockets.in(updatedChat._id).emit("chat.new_msg", {
                    newMessage:
                      updatedChat.messages[updatedChat.messages.length - 1]
                  });

                  io.sockets
                    .in(`chatList#${body.toId}`)
                    .emit("chat.new_chatItem", {
                      newChat: {
                        _id: updatedChat._id,
                        createdAt: updatedChat.createdAt,
                        peer: user,
                        lastMessage: updatedChat.lastMessage
                      }
                    });
                });

              res.json(config.getRespData(false, MSG.postWasUpdated));
            }
          }
        );
      }
    }
  );
}

export default { getChats, getChatMessages, postNewMessage };
