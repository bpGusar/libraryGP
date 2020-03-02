import express from "express";

import withAuth from "../middleware";

import ChatsContr from "../../DB/controllers/Chats";

const app = express();

app.get(
  "/api/chats/:userId",
  (req, res, next) => withAuth(req, res, next),
  (req, res) => {
    ChatsContr.getChats(req, res);
  }
);

export default app;
