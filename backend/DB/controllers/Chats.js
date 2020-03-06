import _ from "lodash";
import { parallel } from "async";

import Chats from "../models/Chats";
import MSG from "../../config/msgCodes";
import * as config from "../config";

function getChats(req, res) {
  const { middlewareUserInfo } = req;

  parallel(
    {
      fondedChats: cb =>
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
          .exec(cb)
    },
    (parErr, result) => {
      const chatsArr = result.fondedChats.map(chat => ({
        _id: chat._id,
        createdAt: chat.createdAt,
        peer: chat.members.find(
          member =>
            _.toString(member._id) !== _.toString(middlewareUserInfo._id)
        ),
        lastMessage: chat.lastMessage
      }));

      if (parErr) {
        res.json(config.getRespData(true, MSG.cantLoadChatList, parErr));
      } else {
        res.json(config.getRespData(false, MSG.chatListFetched, chatsArr));
      }
    }
  );
}

function getChatMessages(req, res) {
  const {
    middlewareUserInfo,
    query: { toId },
    io
  } = req;

  Chats.findOne({
    members: {
      $in: [_.toString(middlewareUserInfo._id), _.toString(toId)]
    }
  })
    .select("messages")
    .exec((err, fondedChatMessages) => {
      if (err) {
        res.json(config.getRespData(true, MSG.cantUpdateSettings, err));
      } else {
        res.json(
          config.getRespData(false, MSG.settingsWasUpdated, fondedChatMessages)
        );
      }
    });
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
              io.sockets.in(updatedChat._id).emit("chat.new_msg", {
                newMessage:
                  updatedChat.messages[updatedChat.messages.length - 1]
              });

              // io.sockets.emit("chat_list", {
              //   chatId: updatedChat._id
              // });
              res.json(config.getRespData(false, MSG.postWasUpdated));
            }
          }
        );
      }
    }
  );
}

export default { getChats, getChatMessages, postNewMessage };
