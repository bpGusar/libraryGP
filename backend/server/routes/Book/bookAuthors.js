import express from "express";

import withAuth from "../../middleware";

import * as config from "../../../DB/config";
import { MSG } from "../../../../config/msgCodes";

import Authors from "../../../DB/models/Authors";

const app = express();

app.post("/api/authors/findOne", withAuth, (req, res) =>
  Authors.findOne({ authorName: req.body.authorName }, (err, author) => {
    if (err) {
      res.json(config.getRespData(true, MSG.internalErr500, err));
    } else if (!author) {
      res.json(
        config.getRespData(true, MSG.cantFindAuthor, {
          authorName: req.body.authorName
        })
      );
    } else {
      res.json(config.getRespData(false, null, author));
    }
  })
);

app.post("/api/authors/addOne/", withAuth, (req, res) => {
  const author = new Authors({ authorName: req.body.authorName });
  author.save(err => {
    if (err) {
      res.res.json(config.getRespData(true, MSG.cantAddAuthor, err));
    } else {
      res.send(config.getRespData(false));
    }
  });
});

app.get("/api/authors/getAll/", withAuth, (req, res) =>
  Authors.find({}, (err, author) => {
    if (err) {
      res.json(config.getRespData(true, MSG.internalErr500, err));
    } else {
      res.json(config.getRespData(false, null, author));
    }
  })
);

export default app;
