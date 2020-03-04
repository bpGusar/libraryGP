import express from "express";

import withAuth from "../middleware";

import ChatsContr from "../../DB/controllers/Chats";

const app = express();

app.get(
  "/api/chats",
  (req, res, next) => withAuth(req, res, next),
  (req, res) => {
    ChatsContr.getChats(req, res);
  }
);

app.get(
  "/api/chats/messages",
  (req, res, next) => withAuth(req, res, next),
  (req, res) => {
    ChatsContr.getChatMessages(req, res);
  }
);

app.post(
  "/api/chats/messages",
  (req, res, next) => withAuth(req, res, next),
  (req, res) => {
    ChatsContr.postNewMessage(req, res);
  }
);

export default app;
